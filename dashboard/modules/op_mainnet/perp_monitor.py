import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_many_bars, export_data


## data
@st.cache_data(ttl=60)
def fetch_data():
    # initialize connection
    conn = sqlite3.connect("/app/data/perps.db")

    # read data
    df_trade = pd.read_sql("SELECT * FROM v2_trades order by timestamp", conn)
    df = pd.read_sql("SELECT * FROM v2_debt order by timestamp", conn)

    df["date"] = pd.to_datetime(df["timestamp"], unit="s")
    df_trade["date"] = pd.to_datetime(df_trade["timestamp"], unit="s")

    df["date_hour"] = df["date"].dt.floor("H")
    df_trade["date_hour"] = df_trade["date"].dt.floor("H")
    return df, df_trade


def make_hourly_data(df, df_trade):
    # get hourly count of trades
    df_trade["trades"] = df_trade["orderType"].apply(
        lambda x: 1 if x != "Liquidation" else 0
    )
    df_trade["liquidations"] = df_trade["orderType"].apply(
        lambda x: 1 if x == "Liquidation" else 0
    )

    df_trade_hourly = (
        df_trade[
            [
                "asset",
                "date_hour",
                "trades",
                "liquidations",
            ]
        ]
        .groupby(["asset", "date_hour"])
        .sum()
        .reset_index()
    )

    # make hourly data
    df_hourly = df.groupby(["asset", "date_hour"])[
        [
            "cumulative_volume",
            "staker_pnl",
            "fees_paid",
            "exchange_fees",
            "keeper_fees",
            "liq_fees",
        ]
    ].last()

    # add some columns
    df_hourly["volume"] = df_hourly.groupby("asset")["cumulative_volume"].diff()
    df_hourly["staker_pnl"] = df_hourly.groupby("asset")["staker_pnl"].diff()
    df_hourly["exchange_fees"] = df_hourly.groupby("asset")["exchange_fees"].diff()
    df_hourly["liq_fees"] = df_hourly.groupby("asset")["liq_fees"].diff()
    df_hourly["protocol_fees"] = df_hourly["exchange_fees"] + df_hourly["liq_fees"]

    df_final = df_hourly.merge(df_trade_hourly, on=["asset", "date_hour"], how="left")
    return df_final


def filter_data(df, df_trade, start_date, end_date, assets):
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date).replace(hour=23, minute=59, second=59)

    df = df[
        (df["date"] >= start_date)
        & (df["date"] <= end_date)
        & (df["asset"].isin(assets))
    ]
    df_hourly = make_hourly_data(
        df[df["asset"].isin(assets)], df_trade[df_trade["asset"].isin(assets)]
    )
    df_hourly = df_hourly[
        (df_hourly["date_hour"] >= start_date) & (df_hourly["date_hour"] <= end_date)
    ]
    df_trade = df_trade[
        (df_trade["date"] >= start_date) & (df_trade["date"] <= end_date)
    ]
    return df, df_hourly, df_trade


## charts
def make_charts(df_hourly):
    return {
        "volume": chart_many_bars(
            df_hourly,
            "date_hour",
            ["volume"],
            "Volume",
            "asset",
        ),
        "pnl": chart_many_bars(
            df_hourly,
            "date_hour",
            ["staker_pnl"],
            "Staker Pnl",
            "asset",
        ),
        "exchange_fees": chart_many_bars(
            df_hourly,
            "date_hour",
            ["exchange_fees"],
            "Exchange Fees",
            "asset",
        ),
        "liquidation_fees": chart_many_bars(
            df_hourly,
            "date_hour",
            ["liq_fees"],
            "Liquidation Fees",
            "asset",
        ),
        "trades": chart_many_bars(
            df_hourly,
            "date_hour",
            ["trades"],
            "Trades",
            "asset",
            y_format="#",
        ),
        "liquidations": chart_many_bars(
            df_hourly,
            "date_hour",
            ["liquidations"],
            "Liquidations",
            "asset",
            y_format="#",
        ),
    }


def main():
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
        start_date = st.date_input("Start", datetime.today().date() - timedelta(days=3))

    with filt_col2:
        end_date = st.date_input("End", datetime.today().date())

    with st.expander("Filter markets"):
        assets_filter = st.multiselect("Select markets", assets, default=assets)

    ## filter the data
    df, df_hourly, df_trade = filter_data(
        df, df_trade, start_date, end_date, assets_filter
    )

    ## make the charts
    charts = make_charts(df_hourly)

    ## display
    col1, col2 = st.columns(2)

    with col1:
        st.plotly_chart(charts["volume"], use_container_width=True)
        st.plotly_chart(charts["exchange_fees"], use_container_width=True)
        st.plotly_chart(charts["trades"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["pnl"], use_container_width=True)
        st.plotly_chart(charts["liquidation_fees"], use_container_width=True)
        st.plotly_chart(charts["liquidations"], use_container_width=True)

    ## export
    exports = [
        {
            "title": "Hourly Data",
            "df": df_hourly,
        }
    ]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
