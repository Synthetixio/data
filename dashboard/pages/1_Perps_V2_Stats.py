import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_bars, chart_lines, export_data

st.set_page_config(
    page_title="Perps V2 Stats",
    layout="wide",
)

hide_footer = """
    <style>
        footer {visibility: hidden;}
    </style>
"""
st.markdown(hide_footer, unsafe_allow_html=True)


## data
@st.cache_data(ttl=600)
def fetch_data():
    # initialize connection
    conn = sqlite3.connect('/app/data/perps.db')

    # read data
    df_trade = pd.read_sql("SELECT * FROM v2_trades order by timestamp", conn)
    df = pd.read_sql("SELECT * FROM v2_debt order by timestamp", conn)

    df["date"] = pd.to_datetime(df["timestamp"], unit="s")
    df_trade["date"] = pd.to_datetime(df_trade["timestamp"], unit="s")
    return df, df_trade


def make_daily_data(df):
    # make daily data
    df_daily = (
        df.groupby("date")[
            [
                "cumulative_volume",
                "staker_pnl",
                "fees_paid",
                "exchange_fees",
                "keeper_fees",
                "liq_fees",
            ]
        ]
        .sum()
        .reset_index()
    )

    df_daily["day"] = df_daily["date"].dt.floor("D")
    df_daily = df_daily.sort_values("date").groupby("day").last().reset_index()

    # add some columns
    df_daily["daily_volume"] = df_daily["cumulative_volume"].diff()
    df_daily["daily_staker_pnl"] = df_daily["staker_pnl"].diff()
    df_daily["daily_exchange_fees"] = df_daily["exchange_fees"].diff()
    df_daily["daily_liq_fees"] = df_daily["liq_fees"].diff()
    df_daily["protocol_fees"] = df_daily["exchange_fees"] + df_daily["liq_fees"]
    return df_daily


def filter_data(df, df_trade, start_date, end_date, assets):
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date).replace(hour=23, minute=59, second=59)

    df = df[
        (df["date"] >= start_date)
        & (df["date"] <= end_date)
        & (df["asset"].isin(assets))
    ]
    df_daily = make_daily_data(df[df["asset"].isin(assets)])
    df_daily = df_daily[(df_daily["day"] >= start_date) & (df_daily["day"] <= end_date)]
    df_trade = df_trade[
        (df_trade["date"] >= start_date) & (df_trade["date"] <= end_date)
    ]
    return df, df_daily, df_trade


## charts
@st.cache_data(ttl=600)
def make_charts(df, df_daily, df_trade):
    return {
        "pnl": chart_lines(df_daily, "date", ["staker_pnl"], "Cumulative Staker Pnl"),
        "daily_pnl": chart_bars(
            df_daily, "day", ["daily_staker_pnl"], "Daily Staker Pnl"
        ),
        "cumulative_volume": chart_lines(
            df_daily, "date", ["cumulative_volume"], "Cumulative Volume"
        ),
        "daily_volume": chart_bars(df_daily, "day", ["daily_volume"], "Daily Volume"),
        "fees": chart_lines(
            df_daily, "date", ["liq_fees", "exchange_fees"], "Cumulative Fees"
        ),
        "daily_fees": chart_bars(
            df_daily, "day", ["daily_liq_fees", "daily_exchange_fees"], "Daily Fees"
        ),
    }


df, df_trade = fetch_data()

## get list of assets sorted by highest volume
assets = (
    df_trade.groupby("asset")["volume"]
    .sum()
    .sort_values(ascending=False)
    .index.tolist()
)

## inputs
filt_col1, filt_col2 = st.columns(2)
with filt_col1:
    start_date = st.date_input("Start", datetime.today().date() - timedelta(days=30))

with filt_col2:
    end_date = st.date_input("End", datetime.today().date())

with st.expander("Filter markets"):
    assets_filter = st.multiselect("Select markets", assets, default=assets)

## filter the data
df, df_daily, df_trade = filter_data(df, df_trade, start_date, end_date, assets_filter)

## make the charts
charts = make_charts(df, df_daily, df_trade)

## display
col1, col2 = st.columns(2)

with col1:
    st.plotly_chart(charts["pnl"], use_container_width=True)
    st.plotly_chart(charts["cumulative_volume"], use_container_width=True)
    st.plotly_chart(charts["fees"], use_container_width=True)

with col2:
    st.plotly_chart(charts["daily_pnl"], use_container_width=True)
    st.plotly_chart(charts["daily_volume"], use_container_width=True)
    st.plotly_chart(charts["daily_fees"], use_container_width=True)

with st.container():
    export_data(df_daily)
