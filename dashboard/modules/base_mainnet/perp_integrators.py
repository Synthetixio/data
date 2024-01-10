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
    df_hourly_stats = pd.read_sql_query(
        f"""
        SELECT * FROM base_mainnet.fct_perp_tracking_stats_hourly
    """,
        db,
    )

    df_daily_stats = pd.read_sql_query(
        f"""
        SELECT * FROM base_mainnet.fct_perp_tracking_stats_daily
    """,
        db,
    )

    db.close()

    return {
        "hourly_stats": df_hourly_stats,
        "daily_stats": df_daily_stats,
    }


@st.cache_data(ttl=1)
def make_charts(data, settings):
    df_stats = data[f"{settings['resolution']}_stats"]

    return {
        "accounts": chart_bars(
            df_stats, "ts", ["accounts"], "Accounts", color="tracking_code"
        ),
        "volume": chart_bars(
            df_stats, "ts", ["volume"], "Volume", color="tracking_code"
        ),
        "volume_pct": chart_bars(
            df_stats, "ts", ["volume_share"], "Volume %", color="tracking_code"
        ),
        "trades": chart_bars(
            df_stats, "ts", ["trades"], "Trades", color="tracking_code"
        ),
        "trades_pct": chart_bars(
            df_stats, "ts", ["trades_share"], "Trades %", color="tracking_code"
        ),
        "fees": chart_bars(df_stats, "ts", ["fees"], "Fees", color="tracking_code"),
        "fees_pct": chart_bars(
            df_stats, "ts", ["fees_share"], "Volume %", color="tracking_code"
        ),
    }


def main():
    ## fetch data
    data = fetch_data()

    ## inputs
    with st.expander("Settings") as expander:
        resolution = st.radio("Resolution", ["daily", "hourly"])

        settings = {"resolution": resolution}

    ## make the charts
    charts = make_charts(data, settings)

    ## display
    st.markdown("## Perps V3 Integrators")

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
