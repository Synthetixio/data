import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_market_bars, chart_market_lines, chart_market_oi
from utils import get_connection

st.set_page_config(
    page_title="Perps V3 Markets",
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

    # read data
    df_market_history = pd.read_sql_query(
        "SELECT * FROM base_goerli.fct_perp_market_history", db
    )
    df_trades = pd.read_sql_query("SELECT * FROM base_goerli.fct_perp_trades", db)

    db.close()

    return df_market_history, df_trades


df_market_history, df_trades = fetch_data()
assets = sorted(
    df_market_history["market_symbol"].unique(),
    key=lambda x: (x != "ETH", x != "BTC", x),
)


## charts
def make_charts(df_market_history, df_trades, asset):
    return {
        # 'cumulative_volume': chart_market_lines(df_trades, asset, 'date', ['cumulativeVolume'], 'Cumulative Volume'),
        # 'cumulative_fees': chart_market_lines(df_trades, asset, 'date', ['cumulativeFees'], 'Cumulative Fees'),
        "funding": chart_market_lines(
            df_market_history, asset, "updated_ts", ["funding_rate"], "Funding Rate"
        ),
        "price": chart_market_lines(
            df_market_history, asset, "updated_ts", ["price"], "Price"
        ),
        "skew": chart_market_lines(
            df_market_history, asset, "updated_ts", ["skew"], "Market Skew"
        ),
        "oi": chart_market_lines(
            df_market_history, asset, "updated_ts", ["size_usd"], "Open Interest $"
        ),
        "oi_pct": chart_market_oi(df_market_history, asset),
    }


## inputs
asset = st.selectbox("Select asset", assets, index=0)

## make the charts
charts = make_charts(df_market_history, df_trades, asset)

## display
st.plotly_chart(charts["price"], use_container_width=True)

col1, col2 = st.columns(2)
with col1:
    st.plotly_chart(charts["oi"], use_container_width=True)
    # st.plotly_chart(charts['cumulative_volume'], use_container_width=True)
    st.plotly_chart(charts["skew"], use_container_width=True)

with col2:
    st.plotly_chart(charts["oi_pct"], use_container_width=True)
    # st.plotly_chart(charts['cumulative_fees'], use_container_width=True)
    st.plotly_chart(charts["funding"], use_container_width=True)
