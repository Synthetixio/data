import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import get_connection
from utils import chart_bars, chart_lines


## data
@st.cache_data(ttl=1)
def fetch_data(account_id="NULL"):
    # initialize connection
    db = get_connection()

    # read data
    df_order = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.fct_perp_orders
    """,
        db,
    )
    df_order_expired = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.perp_previous_order_expired
        WHERE account_id = {account_id}
    """,
        db,
    )
    df_trade = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.fct_perp_trades
        WHERE account_id = {account_id}
    """,
        db,
    )
    df_transfer = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.perp_collateral_modified
        WHERE account_id = {account_id}
    """,
        db,
    )
    df_account_liq = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.fct_perp_liq_account
        WHERE account_id = {account_id}
    """,
        db,
    )
    df_position_liq = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.fct_perp_liq_position
        WHERE account_id = {account_id}
    """,
        db,
    )

    df_hourly = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.fct_perp_account_stats_hourly
        WHERE account_id = {account_id}
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
        "trade": df_trade,
        "transfer": df_transfer,
        "account_liq": df_account_liq,
        "position_liq": df_position_liq,
        "hourly": df_hourly,
    }


@st.cache_data(ttl=1)
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
    data = fetch_data()

    ## inputs
    st.markdown("## Perps Account Lookup")
    with st.expander("Look up accounts by address"):
        address = st.text_input("Enter an address to look up associated accounts")

        df_accounts = data["accounts"]
        account_numbers = df_accounts[(df_accounts["owner"] == address)]["id"].unique()

        # account_numbers
        if len(account_numbers) > 0:
            st.dataframe(account_numbers, hide_index=True)

    accounts = data["accounts"]["id"].unique()
    accounts = sorted(list([int(_) for _ in accounts]))
    account = st.selectbox("Select account", accounts, index=0)

    data = fetch_data(account_id=account)

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
    df_open_account = df_open_positions[df_open_positions["account_id"] == account]

    last_liq = (
        data["account_liq"]
        .loc[data["account_liq"]["account_id"] == account, "ts"]
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

    # Recent transfers
    st.markdown(
        """
    ### Recent Transfers
    """
    )

    st.dataframe(
        data["transfer"][
            [
                "block_timestamp",
                "account_id",
                "synth_market_id",
                "amount_delta",
            ]
        ]
        .sort_values("block_timestamp", ascending=False)
        .head(50),
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
        data["account_liq"][["ts", "account_id", "total_reward"]]
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
                "block_timestamp",
                "account_id",
                "market_id",
                "acceptable_price",
                "commitment_time",
            ]
        ],
        use_container_width=True,
        hide_index=True,
    )
