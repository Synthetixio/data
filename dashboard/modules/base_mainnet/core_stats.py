import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import get_connection
from utils import chart_bars, chart_lines, export_data

## set default filters
filters = {
    "start_date": datetime.today().date() - timedelta(days=14),
    "end_date": datetime.today().date() + timedelta(days=1),
}


## data
@st.cache_data(ttl=1)
def fetch_data(filters):
    # get filters
    start_date = filters["start_date"]
    end_date = filters["end_date"]

    # initialize connection
    db = get_connection()

    # get account data
    df_collateral = pd.read_sql_query(
        f"""
        SELECT ts, collateral_type, amount_deposited FROM base_mainnet.fct_core_pool_collateral
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
    """,
        db,
    )

    df_delegation = pd.read_sql_query(
        f"""
        SELECT ts, pool_id, collateral_type, amount_delegated FROM base_mainnet.fct_core_pool_delegation
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
    """,
        db,
    )

    df_account_delegation = pd.read_sql_query(
        f"""
        SELECT * FROM base_mainnet.fct_core_account_delegation
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
    """,
        db,
    )

    df_market_updated = pd.read_sql_query(
        f"""
        SELECT * FROM base_mainnet.fct_core_market_updated
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        ORDER BY ts
    """,
        db,
    )

    df_pnl = pd.read_sql_query(
        f"""
        SELECT * FROM base_mainnet.fct_perp_pnl
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        ORDER BY ts
    """,
        db,
    )

    df_apr = pd.read_sql_query(
        f"""
        SELECT * FROM base_mainnet.fct_core_apr
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        and market_id != 1
        ORDER BY ts
    """,
        db,
    )

    return {
        "collateral": df_collateral,
        "delegation": df_delegation,
        "account_delegation": df_account_delegation,
        "market_updated": df_market_updated,
        "pnl": df_pnl,
        "apr": df_apr,
    }


@st.cache_data(ttl=1)
def make_charts(data):
    return {
        "collateral": chart_lines(
            data["collateral"],
            "ts",
            ["amount_deposited"],
            "Collateral Deposited",
            "collateral_type",
        ),
        "delegation": chart_lines(
            data["delegation"],
            "ts",
            ["amount_delegated"],
            "Collateral Delegated",
            "collateral_type",
        ),
        "reported_debt": chart_lines(
            data["market_updated"],
            "ts",
            ["reported_debt"],
            "Reported Debt",
            "market_id",
        ),
        "credit_capacity": chart_lines(
            data["market_updated"],
            "ts",
            ["credit_capacity"],
            "Credit Capacity",
            "market_id",
        ),
        "net_issuance": chart_lines(
            data["market_updated"],
            "ts",
            ["net_issuance"],
            "Net Issuance",
            "market_id",
        ),
        "pnl": chart_lines(
            data["pnl"],
            "ts",
            ["market_pnl"],
            "Pnl",
            "market_id",
        ),
        "hourly_pnl": chart_bars(
            data["apr"],
            "ts",
            ["hourly_pnl"],
            "Hourly Pnl",
        ),
        "apr": chart_lines(
            data["apr"],
            "ts",
            ["apr_7d", "apy_7d"],
            "APR and APY",
            smooth=True,
            y_format="%",
        ),
    }


def main():
    ## title
    st.markdown("## V3 Core")

    ## inputs
    with st.expander("Filters"):
        filt_col1, filt_col2 = st.columns(2)
        with filt_col1:
            filters["start_date"] = st.date_input("Start", filters["start_date"])

        with filt_col2:
            filters["end_date"] = st.date_input("End", filters["end_date"])

    data = fetch_data(filters)

    ## make the charts
    charts = make_charts(data)

    ## display
    col1, col2 = st.columns(2)
    with col1:
        st.plotly_chart(charts["collateral"], use_container_width=True)
        st.plotly_chart(charts["reported_debt"], use_container_width=True)
        st.plotly_chart(charts["net_issuance"], use_container_width=True)
        st.plotly_chart(charts["hourly_pnl"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["delegation"], use_container_width=True)
        st.plotly_chart(charts["credit_capacity"], use_container_width=True)
        st.plotly_chart(charts["pnl"], use_container_width=True)
        st.plotly_chart(charts["apr"], use_container_width=True)

    st.markdown("## Top Delegators")
    st.dataframe(
        data["account_delegation"]
        .sort_values("amount_delegated", ascending=False)
        .head(25)
    )

    st.markdown("## Markets")

    st.markdown("### sUSDC Market")
    st.dataframe(
        data["market_updated"][data["market_updated"]["market_id"] == 1]
        .sort_values("ts", ascending=False)
        .head(25)
    )

    st.markdown("### Perps Markets")
    st.dataframe(
        data["market_updated"][data["market_updated"]["market_id"] == 2]
        .sort_values("ts", ascending=False)
        .head(25)
    )

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
