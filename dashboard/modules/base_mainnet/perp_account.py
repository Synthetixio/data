import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import get_connection
from utils import chart_bars, chart_lines, export_data

## set default filters
filters = {
    "account_id": "NULL",
    "start_date": datetime.today().date() - timedelta(days=14),
    "end_date": datetime.today().date() + timedelta(days=1),
}


## data
@st.cache_data(ttl=60)
def fetch_data(filters):
    # get filters
    account_id = filters["account_id"]
    start_date = filters["start_date"]
    end_date = filters["end_date"]

    # initialize connection
    db = get_connection()

    # read data
    df_order = pd.read_sql_query(
        f"""
        SELECT distinct account_id, sender FROM {st.secrets.database.DB_ENV}_base_mainnet.fct_perp_orders_base_mainnet
    """,
        db,
    )
    df_order_expired = pd.read_sql_query(
        f"""
        SELECT
            block_timestamp,
            cast(account_id as text) as account_id,
            market_id,
            acceptable_price,
            commitment_time
        FROM {st.secrets.database.DB_ENV}_base_mainnet.fct_perp_previous_order_expired_base_mainnet
        WHERE account_id = {account_id if account_id else 'NULL'}
        and date(block_timestamp) >= '{start_date}' and date(block_timestamp) <= '{end_date}'
    """,
        db,
    )
    df_trade = pd.read_sql_query(
        f"""
        SELECT
            ts,
            cast(account_id as text) as account_id,
            market_id,
            market_symbol,
            position_size,
            notional_position_size,
            trade_size,
            notional_trade_size,
            fill_price,
            total_fees,
            accrued_funding,
            tracking_code
        FROM {st.secrets.database.DB_ENV}_base_mainnet.fct_perp_trades_base_mainnet
        WHERE account_id = '{account_id}'
        and ts >= '{start_date}' and ts <= '{end_date}'
    """,
        db,
    )
    df_transfer = pd.read_sql_query(
        f"""
        SELECT
            block_timestamp,
            cast(account_id as text) as account_id,
            synth_market_id,
            amount_delta
        FROM {st.secrets.database.DB_ENV}_base_mainnet.fct_perp_collateral_modified_base_mainnet
        WHERE account_id = {account_id if account_id else 'NULL'}
        and date(block_timestamp) >= '{start_date}' and date(block_timestamp) <= '{end_date}'
    """,
        db,
    )
    df_interest = pd.read_sql_query(
        f"""
        SELECT
            block_timestamp,
            transaction_hash,
            cast(account_id as text) as account_id,
            interest
        FROM {st.secrets.database.DB_ENV}_base_mainnet.fct_perp_interest_charged_base_mainnet
        WHERE account_id = {account_id if account_id else 'NULL'}
        and date(block_timestamp) >= '{start_date}' and date(block_timestamp) <= '{end_date}'
    """,
        db,
    )

    df_account_liq = pd.read_sql_query(
        f"""
        SELECT
            ts,
            account_id,
            total_reward
        FROM {st.secrets.database.DB_ENV}_base_mainnet.fct_perp_liq_account_base_mainnet
        WHERE account_id = '{account_id}'
        and ts >= '{start_date}' and ts <= '{end_date}'
    """,
        db,
    )
    df_hourly = pd.read_sql_query(
        f"""
        SELECT
            ts,
            cumulative_volume,
            cumulative_fees
        FROM {st.secrets.database.DB_ENV}_base_mainnet.fct_perp_account_stats_hourly_base_mainnet
        WHERE account_id = '{account_id}'
        and ts >= '{start_date}' and ts <= '{end_date}'
        order by ts
    """,
        db,
    )

    df_accounts = df_order[["account_id", "sender"]].drop_duplicates()
    df_accounts.columns = ["id", "owner"]

    # one basic transform
    df_transfer["amount_delta"] = df_transfer["amount_delta"] / 1e18

    db.close()

    return {
        "accounts": df_accounts,
        "order_expired": df_order_expired,
        "interest": df_interest,
        "trade": df_trade,
        "transfer": df_transfer,
        "account_liq": df_account_liq,
        "hourly": df_hourly,
    }


def make_charts(data):
    return {
        "cumulative_volume": chart_lines(
            data["hourly"], "ts", ["cumulative_volume"], "Cumulative Volume"
        ),
        "cumulative_fees": chart_lines(
            data["hourly"], "ts", ["cumulative_fees"], "Cumulative Fees"
        ),
    }


def main():
    st.markdown("## V3 Perps Accounts")
    data = fetch_data(filters)

    ## date filter
    with st.expander("Date filter"):
        filt_col1, filt_col2 = st.columns(2)
        with filt_col1:
            filters["start_date"] = st.date_input("Start", filters["start_date"])

        with filt_col2:
            filters["end_date"] = st.date_input("End", filters["end_date"])

    ## account lookup
    with st.expander("Look up accounts by address"):
        address = st.text_input("Enter an address to look up associated accounts")

        df_accounts = data["accounts"]
        account_numbers = df_accounts[(df_accounts["owner"] == address)]["id"].unique()

        # account_numbers
        if len(account_numbers) > 0:
            st.dataframe(account_numbers, hide_index=True)

    ## account select
    accounts = data["accounts"]["id"].unique()
    accounts = sorted(list([int(_) for _ in accounts]))
    filters["account_id"] = st.selectbox("Select account", accounts, index=0)
    data = fetch_data(filters)

    ## do some lighter transforms
    df_open_positions = (
        data["trade"]
        .sort_values("ts")
        .groupby(["account_id", "market_id"])
        .last()
        .reset_index()
    )
    df_open_positions = df_open_positions[df_open_positions["position_size"].abs() > 0]

    ## make the charts
    charts = make_charts(data)

    ## display
    # Open positions
    df_open_account = df_open_positions[
        df_open_positions["account_id"] == filters["account_id"]
    ]

    last_liq = (
        data["account_liq"]
        .loc[data["account_liq"]["account_id"] == filters["account_id"], "ts"]
        .max()
    )

    # this is a hack to handle the case where there are no liquidations
    last_liq = last_liq if pd.isna(last_liq) == False else "2023-01-01 00:00:00+00:00"

    df_open_account = df_open_account.loc[
        df_open_account["ts"] > last_liq,
        ["account_id", "market_symbol", "position_size", "notional_position_size"],
    ]

    st.markdown(
        """
    ### Open Positions
    """
    )
    if len(df_open_account) > 0:
        df_open_account
    else:
        st.markdown(
            """
        No open positions
        """
        )

    col1, col2 = st.columns(2)

    with col1:
        st.plotly_chart(charts["cumulative_volume"], use_container_width=True)
        pass

    with col2:
        st.plotly_chart(charts["cumulative_fees"], use_container_width=True)
        pass

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

    # Recent transfers
    st.markdown(
        """
    ### Recent Transfers
    """
    )

    st.dataframe(
        data["transfer"].sort_values("block_timestamp", ascending=False).head(50),
        use_container_width=True,
        hide_index=True,
    )

    # Account liquidations table
    st.markdown(
        """
    ### Liquidations
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
        data["order_expired"],
        use_container_width=True,
        hide_index=True,
    )

    # Interest charged table
    st.markdown(
        """
    ### Interest Charged
    """
    )

    st.dataframe(
        data["interest"],
        use_container_width=True,
        hide_index=True,
    )

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
