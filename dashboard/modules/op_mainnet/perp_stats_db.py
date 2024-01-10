import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_bars, chart_lines, export_data
from utils import get_connection


## data
@st.cache_data(ttl=600)
def fetch_data():
    # initialize connection
    db = get_connection()

    df_market_stats = pd.read_sql_query(
        f"""
        SELECT * FROM optimism_mainnet.fct_v2_market_stats order by ts
    """,
        db,
    )

    return {
        "market_stats": df_market_stats,
    }


## charts
@st.cache_data(ttl=1)
def make_charts(data):
    return {
        # "pnl": chart_lines(df_daily, "date", ["staker_pnl"], "Cumulative Staker Pnl"),
        # "daily_pnl": chart_bars(
        #     df_daily, "day", ["daily_staker_pnl"], "Daily Staker Pnl"
        # ),
        "cumulative_volume": chart_lines(
            data["market_stats"],
            "ts",
            ["cumulative_volume"],
            "Cumulative Volume",
            color="market",
        ),
        "cumulative_fees": chart_lines(
            data["market_stats"],
            "ts",
            ["cumulative_exchange_fees"],
            "Cumulative Fees",
            color="market",
        ),
        # "daily_volume": chart_bars(df_daily, "day", ["daily_volume"], "Daily Volume"),
        # "fees": chart_lines(
        #     df_daily, "date", ["liq_fees", "exchange_fees"], "Cumulative Fees"
        # ),
        # "daily_fees": chart_bars(
        #     df_daily, "day", ["daily_liq_fees", "daily_exchange_fees"], "Daily Fees"
        # ),
        # "oi": chart_lines(
        #     df_oi,
        #     "date",
        #     ["total_oi", "eth_btc_oi", "other_oi"],
        #     "Open Interest ($)",
        # ),
    }


def main():
    data = fetch_data()

    # st.dataframe(data["market_stats"])

    ## get list of assets sorted by highest volume
    # assets = (
    #     df_trade.groupby("asset")["volume"]
    #     .sum()
    #     .sort_values(ascending=False)
    #     .index.tolist()
    # )

    ## inputs
    filt_col1, filt_col2 = st.columns(2)
    with filt_col1:
        start_date = st.date_input(
            "Start", datetime.today().date() - timedelta(days=30)
        )

    with filt_col2:
        end_date = st.date_input("End", datetime.today().date())

    # with st.expander("Filter markets"):
    #     assets_filter = st.multiselect("Select markets", assets, default=assets)

    ## filter the data
    # df, df_daily, df_trade, df_oi = filter_data(
    #     df, df_trade, start_date, end_date, assets_filter
    # )

    ## make the charts
    charts = make_charts(data)

    ## display
    col1, col2 = st.columns(2)

    with col1:
        # st.plotly_chart(charts["pnl"], use_container_width=True)
        # st.plotly_chart(charts["cumulative_volume"], use_container_width=True)
        # st.plotly_chart(charts["fees"], use_container_width=True)
        pass

    with col2:
        # st.plotly_chart(charts["daily_pnl"], use_container_width=True)
        # st.plotly_chart(charts["daily_volume"], use_container_width=True)
        # st.plotly_chart(charts["daily_fees"], use_container_width=True)
        pass

    # st.plotly_chart(charts["oi"], use_container_width=True)
    st.plotly_chart(charts["cumulative_volume"], use_container_width=True)
    st.plotly_chart(charts["cumulative_fees"], use_container_width=True)

    # with st.container():
    #     export_data(df_daily)
