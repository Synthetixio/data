import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import get_connection
from utils import chart_bars, chart_lines

st.set_page_config(
    page_title="Perps V3 Integrators",
    layout="wide",
)

hide_footer = """
    <style>
        footer {visibility: hidden;}
    </style>
"""
st.markdown(hide_footer, unsafe_allow_html=True)


## data
@st.cache_data(ttl=1)
def fetch_data():
    # initialize connection
    db = get_connection()

    # get account data
    df_stats = pd.read_sql_query(
        f"""
        SELECT * FROM base_goerli.fct_perp_tracking_stats_daily
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
            data["stats"], "ts", ["accounts"], "Accounts", color="tracking_code"
        ),
        "volume": chart_bars(
            data["stats"], "ts", ["volume"], "Volume", color="tracking_code"
        ),
        "volume_pct": chart_bars(
            data["stats"], "ts", ["volume_share"], "Volume %", color="tracking_code"
        ),
        "trades": chart_bars(
            data["stats"], "ts", ["trades"], "Trades", color="tracking_code"
        ),
        "trades_pct": chart_bars(
            data["stats"], "ts", ["trades_share"], "Trades %", color="tracking_code"
        ),
        "fees": chart_bars(
            data["stats"], "ts", ["fees"], "Fees", color="tracking_code"
        ),
        "fees_pct": chart_bars(
            data["stats"], "ts", ["fees_share"], "Volume %", color="tracking_code"
        ),
    }


## fetch data
data = fetch_data()

## do some lighter transforms

## make the charts
charts = make_charts(data)

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
