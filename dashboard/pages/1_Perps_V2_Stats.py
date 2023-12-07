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


def make_oi(df):
    # add USD columns
    df["long_oi_usd"] = df["long_oi"] * df["price"]
    df["short_oi_usd"] = df["short_oi"] * df["price"]

    # Convert timestamp to datetime and sort
    df["date"] = pd.to_datetime(df["timestamp"], unit="s")
    df.sort_values(by="date", inplace=True)

    # Create a pivot table for long_oi and short_oi for each asset
    pivot_long_oi = df.pivot_table(
        index="date", columns="asset", values="long_oi_usd", aggfunc="last"
    )
    pivot_short_oi = df.pivot_table(
        index="date", columns="asset", values="short_oi_usd", aggfunc="last"
    )

    # Forward fill missing values
    pivot_long_oi.ffill(inplace=True)
    pivot_short_oi.ffill(inplace=True)

    # Calculate total Open Interest at each timestamp
    total_oi = pivot_long_oi.sum(axis=1) + pivot_short_oi.sum(axis=1)
    total_oi = total_oi.reset_index(name="total_oi")

    # Check if 'ETH' and 'BTC' are in the columns and calculate ETH and BTC Open Interest
    eth_btc_oi_long = (
        pivot_long_oi[["ETH", "BTC"]].sum(axis=1)
        if all(asset in pivot_long_oi.columns for asset in ["ETH", "BTC"])
        else pivot_long_oi[["ETH", "BTC"]].fillna(0).sum(axis=1)
    )
    eth_btc_oi_short = (
        pivot_short_oi[["ETH", "BTC"]].sum(axis=1)
        if all(asset in pivot_short_oi.columns for asset in ["ETH", "BTC"])
        else pivot_short_oi[["ETH", "BTC"]].fillna(0).sum(axis=1)
    )
    eth_btc_oi = eth_btc_oi_long + eth_btc_oi_short

    # Calculate Other Assets Open Interest
    other_assets = pivot_long_oi.columns.difference(["ETH", "BTC"])
    other_oi_long = pivot_long_oi[other_assets].sum(axis=1)
    other_oi_short = pivot_short_oi[other_assets].sum(axis=1)
    other_oi = other_oi_long + other_oi_short

    # Add these columns to the total_oi DataFrame
    total_oi["eth_btc_oi"] = eth_btc_oi.values
    total_oi["other_oi"] = other_oi.values

    total_oi = total_oi.set_index("date").resample("H").last().reset_index()

    # Display or export the summary
    return total_oi


## data
@st.cache_data(ttl=600)
def fetch_data():
    # initialize connection
    conn = sqlite3.connect("/app/data/perps.db")

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
    df_oi = make_oi(df_trade)
    return df, df_daily, df_trade, df_oi


## charts
@st.cache_data(ttl=600)
def make_charts(df, df_daily, df_trade, df_oi):
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
        "oi": chart_lines(
            df_oi,
            "date",
            ["total_oi", "eth_btc_oi", "other_oi"],
            "Open Interest ($)",
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
df, df_daily, df_trade, df_oi = filter_data(
    df, df_trade, start_date, end_date, assets_filter
)

## make the charts
charts = make_charts(df, df_daily, df_trade, df_oi)

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

st.plotly_chart(charts["oi"], use_container_width=True)

with st.container():
    export_data(df_daily)
