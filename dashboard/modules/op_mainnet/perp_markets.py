import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_asset_bars, chart_asset_lines, chart_asset_oi, export_data


## data
@st.cache_data(ttl=600)
def fetch_data():
    # initialize connection
    conn = sqlite3.connect("/app/data/perps.db")

    # read data
    df_trade = pd.read_sql("SELECT * FROM v2_trades order by timestamp", conn)
    df_funding = pd.read_sql("SELECT * FROM v2_funding_rates order by timestamp", conn)
    df = pd.read_sql("SELECT * FROM v2_debt order by timestamp", conn)

    df["date"] = pd.to_datetime(df["timestamp"], unit="s")
    df_trade["date"] = pd.to_datetime(df_trade["timestamp"], unit="s")
    df_funding["date"] = pd.to_datetime(df_funding["timestamp"], unit="s")
    return df, df_trade, df_funding


def make_daily_data(df):
    # make daily data
    df_daily = df.groupby(["date", "asset"])[
        [
            "cumulative_volume",
            "staker_pnl",
            "fees_paid",
            "exchange_fees",
            "keeper_fees",
            "liq_fees",
        ]
    ].sum()

    df_daily = df_daily.reset_index()
    df_daily["day"] = df_daily["date"].dt.floor("D")
    df_daily = (
        df_daily.sort_values(["asset", "date"])
        .groupby(["day", "asset"])
        .last()
        .reset_index()
    )

    # add some columns
    df_daily["daily_volume"] = df_daily.groupby("asset")["cumulative_volume"].diff()
    df_daily["daily_staker_pnl"] = df_daily.groupby("asset")["staker_pnl"].diff()
    df_daily["daily_exchange_fees"] = df_daily.groupby("asset")["exchange_fees"].diff()
    df_daily["daily_liq_fees"] = df_daily.groupby("asset")["liq_fees"].diff()
    df_daily["protocol_fees"] = df_daily["exchange_fees"] + df_daily["liq_fees"]
    return df_daily


def filter_data(df, df_trade, df_funding, start_date, end_date):
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date).replace(hour=23, minute=59, second=59)

    df = df[(df["date"] >= start_date) & (df["date"] <= end_date)]
    df_daily = make_daily_data(df)
    df_daily = df_daily[(df_daily["day"] >= start_date) & (df_daily["day"] <= end_date)]
    df_trade = df_trade[
        (df_trade["date"] >= start_date) & (df_trade["date"] <= end_date)
    ]
    df_funding = df_funding[
        (df_funding["date"] >= start_date) & (df_funding["date"] <= end_date)
    ]
    return df, df_daily, df_trade, df_funding


## charts
@st.cache_data(ttl=1)
def make_charts(df, df_daily, df_trade, df_funding, asset):
    return {
        "cumulative_volume": chart_asset_lines(
            df, asset, "date", ["cumulative_volume"], "Cumulative Volume"
        ),
        "daily_volume": chart_asset_bars(
            df_daily, asset, "day", ["daily_volume"], "Daily Volume"
        ),
        "fees": chart_asset_lines(
            df, asset, "date", ["liq_fees", "exchange_fees"], "Cumulative Fees"
        ),
        "daily_fees": chart_asset_bars(
            df_daily,
            asset,
            "day",
            ["daily_exchange_fees", "daily_liq_fees"],
            "Daily Fees",
        ),
        "pnl": chart_asset_lines(
            df, asset, "date", ["staker_pnl"], "Cumulative Staker Pnl"
        ),
        "daily_pnl": chart_asset_bars(
            df_daily, asset, "day", ["daily_staker_pnl"], "Daily Staker Pnl"
        ),
        "skew": chart_asset_lines(df_trade, asset, "date", ["net_skew"], "Net Skew"),
        "funding": chart_asset_lines(
            df_funding, asset, "date", ["fundingRate"], "Funding Rate"
        ),
        "oi": chart_asset_oi(df_trade, asset),
    }


def main():
    df, df_trade, df_funding = fetch_data()

    ## get list of assets sorted alphabetically
    assets = sorted(
        df_trade["asset"].unique(), key=lambda x: (x != "ETH", x != "BTC", x)
    )

    ## inputs
    filt_col1, filt_col2 = st.columns(2)
    with filt_col1:
        start_date = st.date_input(
            "Start", datetime.today().date() - timedelta(days=30)
        )

    with filt_col2:
        end_date = st.date_input("End", datetime.today().date())

    asset = st.selectbox("Select asset", assets, index=0)

    ## filter the data
    df, df_daily, df_trade, df_funding = filter_data(
        df, df_trade, df_funding, start_date, end_date
    )

    ## make the charts
    charts = make_charts(df, df_daily, df_trade, df_funding, asset)

    ## display
    col1, col2 = st.columns(2)

    with col1:
        st.plotly_chart(charts["pnl"], use_container_width=True)
        st.plotly_chart(charts["cumulative_volume"], use_container_width=True)
        st.plotly_chart(charts["fees"], use_container_width=True)
        st.plotly_chart(charts["skew"], use_container_width=True)
        st.plotly_chart(charts["funding"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["daily_pnl"], use_container_width=True)
        st.plotly_chart(charts["daily_volume"], use_container_width=True)
        st.plotly_chart(charts["daily_fees"], use_container_width=True)
        st.plotly_chart(charts["oi"], use_container_width=True)

    ## export
    exports = [
        {
            "title": "Daily Data",
            "df": df_daily,
        },
        {
            "title": "Hourly Data",
            "df": df,
        },
        {
            "title": "Trades",
            "df": df_trade,
        },
        {
            "title": "Funding Rates",
            "df": df_funding,
        },
    ]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
