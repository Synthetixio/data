import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import get_connection
from utils import chart_bars, chart_lines, export_data


## data
@st.cache_data(ttl=1)
def fetch_data():
    # initialize connection
    db = get_connection()

    # get account data
    df_wrapper = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.fct_spot_wrapper
    """,
        db,
    )

    df_atomics = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.fct_spot_atomics
    """,
        db,
    )

    df_synth_supply = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.fct_synth_supply
    """,
        db,
    )

    return {
        "synth_supply": df_synth_supply,
        "wrapper": df_wrapper,
        "atomics": df_atomics,
    }


@st.cache_data(ttl=1)
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
    data = fetch_data()

    ## make the charts
    charts = make_charts(data)

    ## display
    st.markdown(
        """
    ## V3 Spot Market
    """
    )

    st.plotly_chart(charts["supply"], use_container_width=True)

    # Wrapper table
    st.markdown(
        """
    ### Wrapper
    """
    )

    st.dataframe(
        data["wrapper"][
            ["ts", "block_number", "tx_hash", "synth_market_id", "amount_wrapped"]
        ].sort_values("ts", ascending=False),
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
        data["atomics"][
            ["ts", "block_number", "tx_hash", "synth_market_id", "amount", "price"]
        ].sort_values("ts", ascending=False),
        use_container_width=True,
        hide_index=True,
    )

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
