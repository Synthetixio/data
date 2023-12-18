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

    # get account data
    df_collateral = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.fct_core_pool_collateral
    """,
        db,
    )

    df_delegation = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.fct_core_pool_delegation
    """,
        db,
    )

    db.close()

    return {
        "collateral": df_collateral,
        "delegation": df_delegation,
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
    }


def main():
    data = fetch_data()

    ## make the charts
    charts = make_charts(data)

    ## display
    st.markdown("## V3 Core")
    st.plotly_chart(charts["collateral"], use_container_width=True)
    st.plotly_chart(charts["delegation"], use_container_width=True)
