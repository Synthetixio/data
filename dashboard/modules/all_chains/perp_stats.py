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
    "resolution": "daily",
}


## data
@st.cache_data(ttl=600)
def fetch_data(filters):
    # get filters
    start_date = filters["start_date"]
    end_date = filters["end_date"]
    resolution = filters["resolution"]

    # initialize connection
    db = get_connection()

    # read data
    df_stats = pd.read_sql_query(
        f"""
        with base as (
            SELECT
                ts,
                'Base (V3)' as label,
                volume,
                trades,
                exchange_fees as fees,
                liquidated_accounts as liquidations
            FROM {st.secrets.database.DB_ENV}_base_mainnet.fct_perp_stats_{resolution}_base_mainnet
            WHERE ts >= '{start_date}' and ts <= '{end_date}'
        ),
        optimism as (
            SELECT
                ts,
                'Optimism (V2)' as label,
                volume,
                trades,
                exchange_fees + liquidation_fees as fees,
                liquidations
            FROM {st.secrets.database.DB_ENV}_optimism_mainnet.fct_v2_stats_{resolution}_optimism_mainnet
            where ts >= '{filters["start_date"]}'
                and ts <= '{filters["end_date"]}'
        )
        select * from base
        union all
        select * from optimism
        order by ts
        """,
        db,
    )

    db.close()

    return {
        "stats": df_stats,
    }


def make_charts(data):
    return {
        "volume": chart_bars(
            data["stats"],
            "ts",
            ["volume"],
            "Volume",
            "label",
        ),
        "fees": chart_bars(
            data["stats"],
            "ts",
            ["fees"],
            "Exchange Fees",
            "label",
        ),
        "trades": chart_bars(
            data["stats"],
            "ts",
            ["trades"],
            "Trades",
            "label",
            y_format="#",
        ),
        "liquidations": chart_bars(
            data["stats"],
            "ts",
            ["liquidations"],
            "Liquidations",
            "label",
            y_format="#",
        ),
    }


def main():
    ## title
    st.markdown("## Perps: All Chains")

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
        st.plotly_chart(charts["trades"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["fees"], use_container_width=True)
        st.plotly_chart(charts["liquidations"], use_container_width=True)

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
