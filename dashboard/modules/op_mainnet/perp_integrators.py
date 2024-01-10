import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_bars, chart_lines, export_data


## data
@st.cache_data(ttl=600)
def fetch_data():
    # initialize connection
    conn = sqlite3.connect("/app/data/perps.db")

    # read data
    df = pd.read_sql("SELECT * FROM v2_trades order by timestamp", conn)

    df["date"] = pd.to_datetime(df["timestamp"], unit="s")
    return df


def make_daily_data(df):
    # make daily data
    keepers = [
        "kwenta",
        "polynomial",
        "decentrex",
        "lyra",
        "rage",
        "dhedge",
        "atlantean",
        "valio",
        "copin",
        "dextoro",
        "kwentapysdk",
    ]
    df["tracking_code"] = df["trackingCode"].apply(
        lambda x: x.capitalize()
        if x.lower() in keepers
        else "No tracking code"
        if x == ""
        else "Other"
    )
    df["day"] = df["date"].dt.floor("D")

    df_no_liq = df[df["orderType"] != "Liquidation"]

    df_daily_sum = (
        df_no_liq.groupby(["day", "tracking_code"])[
            [
                "volume",
                "exchange_fees_paid",
            ]
        ]
        .sum()
        .reset_index()
    )
    df_daily_sum.columns = ["day", "tracking_code", "volume", "fees"]

    df_daily_count = (
        df_no_liq.groupby(["day", "tracking_code"])[
            [
                "id",
                "account",
            ]
        ]
        .nunique()
        .reset_index()
    )
    df_daily_count.columns = ["day", "tracking_code", "trades", "traders"]

    # Unique cumulative traders
    def cumulative_unique(df):
        unique_accounts = set()
        result = []

        for account in df["account"]:
            unique_accounts.add(account)
            result.append(len(unique_accounts))

        return pd.Series(result, index=df.index)

    df_no_liq["traders_cumulative"] = (
        df_no_liq.groupby("tracking_code")
        .apply(cumulative_unique)
        .reset_index(level=0, drop=True)
    )
    df_traders = df_no_liq.drop_duplicates(
        subset=["tracking_code", "day"], keep="last"
    )[["tracking_code", "day", "traders_cumulative"]]

    # merge the datasets
    df_daily = df_daily_sum.merge(
        df_daily_count, how="left", on=["day", "tracking_code"]
    )
    df_daily = df_daily.merge(df_traders, how="left", on=["day", "tracking_code"])

    # add percentages
    df_daily["volume_pct"] = df_daily.groupby("day")["volume"].transform(
        lambda x: x / x.sum()
    )
    df_daily["fees_pct"] = df_daily.groupby("day")["fees"].transform(
        lambda x: x / x.sum()
    )
    df_daily["trades_pct"] = df_daily.groupby("day")["trades"].transform(
        lambda x: x / x.sum()
    )

    # add cumulative values
    df_daily["volume_cumulative"] = df_daily.groupby("tracking_code")["volume"].cumsum()
    df_daily["fees_cumulative"] = df_daily.groupby("tracking_code")["fees"].cumsum()
    df_daily["trades_cumulative"] = df_daily.groupby("tracking_code")["trades"].cumsum()
    return df_daily


def filter_data(df, start_date, end_date, assets):
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date).replace(hour=23, minute=59, second=59)

    df = df[
        (df["date"] >= start_date)
        & (df["date"] <= end_date)
        & (df["asset"].isin(assets))
    ]
    df_daily = make_daily_data(df[df["asset"].isin(assets)])
    df_daily = df_daily[(df_daily["day"] >= start_date) & (df_daily["day"] <= end_date)]
    return df, df_daily


## charts
@st.cache_data(ttl=600)
def make_charts(df, df_daily):
    return {
        "fees": chart_bars(
            df_daily, "day", ["fees"], "Fees Paid", color="tracking_code"
        ),
        "fees_pct": chart_bars(
            df_daily, "day", ["fees_pct"], "Fees Paid %", color="tracking_code"
        ),
        "fees_cumulative": chart_lines(
            df_daily,
            "day",
            ["fees_cumulative"],
            "Cumulative Fees Paid",
            color="tracking_code",
        ),
        "volume": chart_bars(
            df_daily, "day", ["volume"], "Volume", color="tracking_code"
        ),
        "volume_pct": chart_bars(
            df_daily, "day", ["volume_pct"], "Volume %", color="tracking_code"
        ),
        "volume_cumulative": chart_lines(
            df_daily,
            "day",
            ["volume_cumulative"],
            "Cumulative Volume",
            color="tracking_code",
        ),
        "traders": chart_bars(
            df_daily, "day", ["traders"], "Traders", color="tracking_code"
        ),
        "traders_cumulative": chart_lines(
            df_daily,
            "day",
            ["traders_cumulative"],
            "Cumulative Traders",
            color="tracking_code",
        ),
        "trades": chart_bars(
            df_daily, "day", ["trades"], "Trades", color="tracking_code"
        ),
        "trades_pct": chart_bars(
            df_daily, "day", ["trades_pct"], "Trades %", color="tracking_code"
        ),
        "trades_cumulative": chart_lines(
            df_daily,
            "day",
            ["trades_cumulative"],
            "Cumulative Trades",
            color="tracking_code",
        ),
    }


def main():
    df = fetch_data()

    ## get list of assets sorted alphabetically
    assets = df["asset"].unique()
    assets.sort()

    ## inputs
    filt_col1, filt_col2 = st.columns(2)
    with filt_col1:
        start_date = st.date_input(
            "Start", datetime.today().date() - timedelta(days=30)
        )

    with filt_col2:
        end_date = st.date_input("End", datetime.today().date())

    with st.expander("Filter markets"):
        assets_filter = st.multiselect("Select markets", assets, default=assets)

    ## filter the data
    df, df_daily = filter_data(df, start_date, end_date, assets_filter)

    ## make the charts
    charts = make_charts(df, df_daily)

    ## display

    col1, col2 = st.columns(2)
    with col1:
        st.plotly_chart(charts["volume_cumulative"], use_container_width=True)
        st.plotly_chart(charts["trades_cumulative"], use_container_width=True)
        st.plotly_chart(charts["fees"], use_container_width=True)
        st.plotly_chart(charts["volume"], use_container_width=True)
        st.plotly_chart(charts["trades"], use_container_width=True)
        st.plotly_chart(charts["traders"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["fees_cumulative"], use_container_width=True)
        st.plotly_chart(charts["traders_cumulative"], use_container_width=True)
        st.plotly_chart(charts["fees_pct"], use_container_width=True)
        st.plotly_chart(charts["volume_pct"], use_container_width=True)
        st.plotly_chart(charts["trades_pct"], use_container_width=True)

    ## export
    exports = [
        {
            "title": "Daily Data",
            "df": df_daily,
        }
    ]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
