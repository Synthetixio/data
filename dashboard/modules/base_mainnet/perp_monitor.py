import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import get_connection
from utils import chart_many_bars, chart_bars, chart_lines, export_data

## set default filters
filters = {
    "start_date": datetime.today().date() - timedelta(days=14),
    "end_date": datetime.today().date() + timedelta(days=1),
    "resolution": "daily",
}


## data
@st.cache_data(ttl=60)
def fetch_data(filters):
    # get filters
    start_date = filters["start_date"]
    end_date = filters["end_date"]
    resolution = filters["resolution"]

    # initialize connection
    db = get_connection()

    # read data
    df_order_expired = pd.read_sql_query(
        f"""
        SELECT
            block_number,
            block_timestamp,
            cast(account_id as text) as account_id,
            market_id,
            acceptable_price,
            commitment_time,
            tracking_code
        FROM prod_base_mainnet.fct_perp_previous_order_expired_base_mainnet
        WHERE date(block_timestamp) >= '{start_date}' and date(block_timestamp) <= '{end_date}'
        ORDER BY block_timestamp
    """,
        db,
    )
    df_trade = pd.read_sql_query(
        f"""
        SELECT
            ts,
            account_id,
            market_symbol,
            position_size,
            trade_size,
            notional_trade_size,
            fill_price,
            total_fees,
            accrued_funding,
            tracking_code,
            transaction_hash
        FROM prod_base_mainnet.fct_perp_trades_base_mainnet
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        ORDER BY ts
    """,
        db,
    )

    df_account_liq = pd.read_sql_query(
        f"""
        SELECT
            ts,
            account_id,
            total_reward
        FROM prod_base_mainnet.fct_perp_liq_account_base_mainnet
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        ORDER BY ts
        """,
        db,
    )

    df_skew = pd.read_sql_query(
        f"""
        SELECT
            ts,
            market_symbol,
            skew,
            skew * price as skew_usd
        FROM prod_base_mainnet.fct_perp_market_history_base_mainnet
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        ORDER BY ts
    """,
        db,
    )

    # hourly data
    df_market = pd.read_sql_query(
        f"""
        SELECT
            ts,
            market_symbol,
            volume,
            trades,
            exchange_fees,
            liquidations
        FROM prod_base_mainnet.fct_perp_market_stats_{resolution}_base_mainnet
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        """,
        db,
    )
    df_stats = pd.read_sql_query(
        f"""
        SELECT
            ts,
            liquidated_accounts,
            liquidation_rewards
        FROM prod_base_mainnet.fct_perp_stats_{resolution}_base_mainnet
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        """,
        db,
    )

    # transform data
    current_skew = (
        df_skew.groupby("market_symbol")
        .tail(1)
        .sort_values("skew_usd", ascending=False)
    )
    current_skew["side"] = current_skew["skew"].apply(
        lambda x: "Long" if x > 0 else ("Short" if x < 0 else "Neutral")
    )

    db.close()

    return {
        "order_expired": df_order_expired,
        "trade": df_trade,
        "account_liq": df_account_liq,
        "market": df_market,
        "stats": df_stats,
        "skew": df_skew,
        "current_skew": current_skew,
    }


def make_charts(data):
    return {
        "volume": chart_many_bars(
            data["market"],
            "ts",
            ["volume"],
            "Volume",
            "market_symbol",
        ),
        "exchange_fees": chart_many_bars(
            data["market"],
            "ts",
            ["exchange_fees"],
            "Exchange Fees",
            "market_symbol",
        ),
        "trades": chart_many_bars(
            data["market"],
            "ts",
            ["trades"],
            "Trades",
            "market_symbol",
            y_format="#",
        ),
        "position_liquidations": chart_many_bars(
            data["market"],
            "ts",
            ["liquidations"],
            "Position Liquidations",
            "market_symbol",
            y_format="#",
        ),
        "account_liquidations": chart_bars(
            data["stats"],
            "ts",
            ["liquidated_accounts"],
            "Account Liquidations",
            y_format="#",
        ),
        "liquidation_rewards": chart_bars(
            data["stats"],
            "ts",
            ["liquidation_rewards"],
            "Liquidation Rewards",
        ),
        "skew": chart_lines(
            data["skew"],
            "ts",
            ["skew_usd"],
            "Market Skew",
            "market_symbol",
        ),
        "current_skew": chart_bars(
            data["current_skew"],
            ["skew_usd"],
            "side",
            "Current Market Skew",
            "market_symbol",
            column=True,
            x_format="$",
            y_format="#",
        ),
    }


def main():
    ## title
    st.markdown("## V3 Perps Monitor")

    ## inputs
    with st.expander("Filters") as expander:
        # resolution
        filters["resolution"] = st.radio("Resolution", ["daily", "hourly"])

        # date filter
        filt_col1, filt_col2 = st.columns(2)
        with filt_col1:
            filters["start_date"] = st.date_input("Start", filters["start_date"])

        with filt_col2:
            filters["end_date"] = st.date_input("End", filters["end_date"])

    ## fetch data
    data = fetch_data(filters)

    ## make the charts
    charts = make_charts(data)

    ## display
    col1, col2 = st.columns(2)

    with col1:
        st.plotly_chart(charts["volume"], use_container_width=True)
        st.plotly_chart(charts["exchange_fees"], use_container_width=True)
        st.plotly_chart(charts["account_liquidations"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["trades"], use_container_width=True)
        st.plotly_chart(charts["position_liquidations"], use_container_width=True)
        st.plotly_chart(charts["liquidation_rewards"], use_container_width=True)

    st.plotly_chart(charts["current_skew"], use_container_width=True)
    st.plotly_chart(charts["skew"], use_container_width=True)

    # Recent trades
    st.markdown(
        """
    ### Recent Trades
    """
    )

    st.dataframe(
        data["trade"].sort_values("ts", ascending=False).head(50),
        use_container_width=True,
        hide_index=True,
    )

    # Account liquidations table
    st.markdown(
        """
    ### Accounts Liquidated
    """
    )

    st.dataframe(
        data["account_liq"].sort_values("ts", ascending=False).head(25),
        use_container_width=True,
        hide_index=True,
    )

    # Expired orders table
    st.markdown(
        """
    ### Expired Orders
    """
    )

    st.dataframe(
        data["order_expired"].sort_values("block_timestamp", ascending=False),
        use_container_width=True,
        hide_index=True,
    )

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
