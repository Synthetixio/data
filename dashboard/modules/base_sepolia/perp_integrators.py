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
@st.cache_data(ttl=1)
def fetch_data(filters):
    # get filters
    start_date = filters["start_date"]
    end_date = filters["end_date"]
    resolution = filters["resolution"]

    # initialize connection
    db = get_connection()

    # get account data
    df_stats = pd.read_sql_query(
        f"""
        SELECT
            ts,
            tracking_code,
            accounts,
            volume,
            volume_share,
            trades,
            trades_share,
            fees,
            fees_share
        FROM base_sepolia.fct_perp_tracking_stats_{resolution}
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
    """,
        db,
    )

    db.close()

    return {
        "stats": df_stats,
    }


@st.cache_data(ttl=1)
def make_charts(data):
    return {
        "accounts": chart_bars(
            data["stats"],
            "ts",
            ["accounts"],
            "Accounts",
            color="tracking_code",
            y_format="#",
        ),
        "volume": chart_bars(
            data["stats"],
            "ts",
            ["volume"],
            "Volume",
            color="tracking_code",
        ),
        "volume_pct": chart_bars(
            data["stats"],
            "ts",
            ["volume_share"],
            "Volume %",
            color="tracking_code",
            y_format="%",
        ),
        "trades": chart_bars(
            data["stats"],
            "ts",
            ["trades"],
            "Trades",
            color="tracking_code",
            y_format="#",
        ),
        "trades_pct": chart_bars(
            data["stats"],
            "ts",
            ["trades_share"],
            "Trades %",
            color="tracking_code",
            y_format="%",
        ),
        "fees": chart_bars(
            data["stats"],
            "ts",
            ["fees"],
            "Fees",
            color="tracking_code",
        ),
        "fees_pct": chart_bars(
            data["stats"],
            "ts",
            ["fees_share"],
            "Fees %",
            color="tracking_code",
            y_format="%",
        ),
    }


def main():
    ## title
    st.markdown("## V3 Perps Integrators")

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
        st.plotly_chart(charts["fees"], use_container_width=True)
        st.plotly_chart(charts["accounts"], use_container_width=True)
        pass

    with col2:
        st.plotly_chart(charts["volume_pct"], use_container_width=True)
        st.plotly_chart(charts["trades_pct"], use_container_width=True)
        st.plotly_chart(charts["fees_pct"], use_container_width=True)
        pass

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
