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
@st.cache_data(ttl=600)
def fetch_data(settings):
    # get filters
    start_date = filters["start_date"]
    end_date = filters["end_date"]

    # initialize connection
    db = get_connection()

    # get account data
    df_wrapper = pd.read_sql_query(
        f"""
        SELECT
            ts,
            block_number,
            tx_hash,
            synth_market_id,
            amount_wrapped
        FROM arbitrum_sepolia.fct_spot_wrapper
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
    """,
        db,
    )

    df_atomics = pd.read_sql_query(
        f"""
        SELECT
            ts,
            block_number,
            tx_hash,
            synth_market_id,
            amount,
            price
        FROM arbitrum_sepolia.fct_spot_atomics
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
    """,
        db,
    )

    df_synth_supply = pd.read_sql_query(
        f"""
        SELECT
            ts,
            synth_market_id,
            supply
        FROM arbitrum_sepolia.fct_synth_supply
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
    """,
        db,
    )

    return {
        "synth_supply": df_synth_supply,
        "wrapper": df_wrapper,
        "atomics": df_atomics,
    }


def make_charts(data):
    return {
        "supply": chart_lines(
            data["synth_supply"],
            "ts",
            ["supply"],
            "Synth Supply",
            "synth_market_id",
        ),
    }


def main():
    ## title
    st.markdown(
        """
    ## V3 Spot Market
    """
    )

    ## inputs
    with st.expander("Filters") as expander:
        # date filter
        filt_col1, filt_col2 = st.columns(2)
        with filt_col1:
            filters["start_date"] = st.date_input("Start", filters["start_date"])

        with filt_col2:
            filters["end_date"] = st.date_input("End", filters["end_date"])

    ## fetch the data
    data = fetch_data(filters)

    ## make the charts
    charts = make_charts(data)

    ## display

    st.plotly_chart(charts["supply"], use_container_width=True)

    # Wrapper table
    st.markdown(
        """
    ### Wrapper
    """
    )

    st.dataframe(
        data["wrapper"].sort_values("ts", ascending=False),
        use_container_width=True,
        hide_index=True,
    )

    # Atomics table
    st.markdown(
        """
    ### Atomic Transactions
    """
    )

    st.dataframe(
        data["atomics"].sort_values("ts", ascending=False),
        use_container_width=True,
        hide_index=True,
    )

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
