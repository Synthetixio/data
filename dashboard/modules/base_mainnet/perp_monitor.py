import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import get_connection
from utils import chart_bars, chart_lines


## data
@st.cache_data(ttl=1)
def fetch_data():
    # initialize connection
    db = get_connection()

    # read data
    df_order_expired = pd.read_sql_query(
        "SELECT * FROM base_mainnet.perp_previous_order_expired", db
    )
    df_trade = pd.read_sql_query("SELECT * FROM base_mainnet.fct_perp_trades", db)
    df_market_updated = pd.read_sql_query(
        "SELECT * FROM base_mainnet.fct_perp_market_history", db
    )
    df_account_liq = pd.read_sql_query(
        "SELECT * FROM base_mainnet.fct_perp_liq_account", db
    )
    df_position_liq = pd.read_sql_query(
        "SELECT * FROM base_mainnet.fct_perp_liq_position", db
    )

    # create hourly data
    df_hourly_market = pd.read_sql_query(
        "SELECT * FROM base_mainnet.fct_perp_market_stats_hourly", db
    )
    df_hourly = pd.read_sql_query(
        "SELECT * FROM base_mainnet.fct_perp_stats_hourly", db
    )

    db.close()

    return {
        "order_expired": df_order_expired,
        "trade": df_trade,
        "market_updated": df_market_updated,
        "account_liq": df_account_liq,
        "position_liq": df_position_liq,
        "hourly_market": df_hourly_market,
        "hourly": df_hourly,
    }


@st.cache_data(ttl=1)
def make_charts(data):
    return {
        "volume": chart_bars(
            data["hourly_market"], "ts", ["volume"], "Volume", "market_symbol"
        ),
        "exchange_fees": chart_bars(
            data["hourly_market"], "ts", ["fees"], "Exchange Fees", "market_symbol"
        ),
        "trades": chart_bars(
            data["hourly_market"], "ts", ["trades"], "Trades", "market_symbol"
        ),
        "position_liquidations": chart_bars(
            data["hourly_market"],
            "ts",
            ["liquidations"],
            "Position Liquidations",
            "market_symbol",
        ),
        "account_liquidations": chart_bars(
            data["hourly"], "ts", ["liquidated_accounts"], "Account Liquidations"
        ),
        "liquidation_rewards": chart_bars(
            data["hourly"], "ts", ["liquidation_rewards"], "Liquidation Rewards"
        ),
    }


def main():
    data = fetch_data()

    ## get list of assets sorted alphabetically
    st.markdown("## Perps V3 Market Monitor")
    assets = sorted(
        data["market_updated"]["market_symbol"].unique(),
        key=lambda x: (x != "ETH", x != "BTC", x),
    )

    ## inputs
    filt_col1, filt_col2 = st.columns(2)
    with filt_col1:
        start_date = st.date_input("Start", datetime.today().date() - timedelta(days=3))

    with filt_col2:
        end_date = st.date_input("End", datetime.today().date())

    with st.expander("Filter markets"):
        assets_filter = st.multiselect("Select markets", assets, default=assets)

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

    # Recent trades
    st.markdown(
        """
    ### Recent Trades
    """
    )

    st.dataframe(
        data["trade"][
            [
                "ts",
                "account_id",
                "market_symbol",
                "position_size",
                "trade_size",
                "notional_trade_size",
                "fill_price",
                "total_fees",
                "accrued_funding",
                "tracking_code",
            ]
        ]
        .sort_values("ts", ascending=False)
        .head(50),
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
        data["account_liq"][
            [
                "ts",
                "account_id",
                "total_reward",
            ]
        ]
        .sort_values("ts", ascending=False)
        .head(25),
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
        data["order_expired"][
            [
                "block_number",
                "block_timestamp",
                "account_id",
                "market_id",
                "acceptable_price",
                "commitment_time",
                "tracking_code",
            ]
        ].sort_values("block_timestamp", ascending=False),
        use_container_width=True,
        hide_index=True,
    )
