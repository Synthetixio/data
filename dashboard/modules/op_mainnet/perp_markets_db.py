import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_bars, chart_lines, chart_oi, export_data
from utils import get_connection, get_v2_markets

## set default filters
filters = {
    "market": "ETH",
    "start_date": datetime.today().date() - timedelta(days=30),
    "end_date": datetime.today().date(),
}

## set default settings
settings = {"resolution": "daily"}


## data
@st.cache_data(ttl=300)
def fetch_data(filters, settings):
    # get settings
    resolution = settings["resolution"]

    # initialize connection
    db = get_connection()

    df_markets = pd.read_sql_query(
        f"""
        SELECT distinct market FROM prod_optimism_mainnet.fct_v2_market_stats_optimism_mainnet
    """,
        db,
    )

    df_market_stats_agg = pd.read_sql_query(
        f"""
        SELECT
            ts,
            market,
            exchange_fees,
            liquidation_fees,
            volume,
            amount_liquidated,
            cumulative_volume,
            cumulative_exchange_fees,
            cumulative_liquidation_fees,
            cumulative_amount_liquidated,
            long_oi_usd,
            short_oi_usd,
            total_oi_usd            
        FROM prod_optimism_mainnet.fct_v2_market_{resolution}_optimism_mainnet
        where
            market = '{filters["market"]}'
            and ts >= '{filters["start_date"]}'
            and ts <= '{filters["end_date"]}'
        order by ts
    """,
        db,
    )

    df_market_stats = pd.read_sql_query(
        f"""
        SELECT
            ts,
            market,
            skew,
            funding_rate,
            long_oi_pct,
            short_oi_pct
        FROM prod_optimism_mainnet.fct_v2_market_stats_optimism_mainnet
        where
            market = '{filters["market"]}'
            and ts >= '{filters["start_date"]}'
            and ts <= '{filters["end_date"]}'
        order by ts
    """,
        db,
    )

    db.close()

    return {
        "market_stats": df_market_stats,
        "market_stats_agg": df_market_stats_agg,
    }


## charts
@st.cache_data(ttl=300)
def make_charts(data, filters):
    return {
        "cumulative_volume": chart_lines(
            data["market_stats_agg"],
            "ts",
            ["cumulative_volume"],
            "Cumulative Volume",
            smooth=True,
        ),
        "daily_volume": chart_bars(
            data["market_stats_agg"],
            "ts",
            ["volume"],
            "Daily Volume",
        ),
        "cumulative_fees": chart_lines(
            data["market_stats_agg"],
            "ts",
            ["cumulative_exchange_fees", "cumulative_liquidation_fees"],
            "Cumulative Fees",
            smooth=True,
        ),
        "daily_fees": chart_bars(
            data["market_stats_agg"],
            "ts",
            ["exchange_fees", "liquidation_fees"],
            "Daily Fees",
        ),
        "cumulative_liquidation": chart_lines(
            data["market_stats_agg"],
            "ts",
            ["cumulative_amount_liquidated"],
            "Cumulative Amount Liquidated",
            smooth=True,
        ),
        "daily_liquidation": chart_bars(
            data["market_stats_agg"],
            "ts",
            ["amount_liquidated"],
            "Daily Amount Liquidated",
        ),
        "skew": chart_lines(
            data["market_stats"],
            "ts",
            ["skew"],
            "Skew",
            y_format="#",
        ),
        "funding_rate": chart_lines(
            data["market_stats"],
            "ts",
            ["funding_rate"],
            "Funding Rate",
            y_format="%",
            smooth=True,
        ),
        "oi_pct": chart_oi(
            data["market_stats"],
            "ts",
            "Open Interest: Long vs Short",
        ),
        "oi_usd": chart_lines(
            data["market_stats_agg"],
            "ts",
            ["long_oi_usd", "short_oi_usd", "total_oi_usd"],
            "Open Interest (USD)",
            smooth=True,
        ),
    }


def main():
    ## get list of markets
    markets = get_v2_markets()
    markets = sorted(
        markets,
        key=lambda x: (x != "ETH", x != "BTC", x),
    )

    ## inputs
    filt_col1, filt_col2 = st.columns(2)
    with filt_col1:
        filters["start_date"] = st.date_input("Start", filters["start_date"])

    with filt_col2:
        filters["end_date"] = st.date_input("End", filters["end_date"])

    filters["market"] = st.selectbox("Select asset", markets, index=0)

    with st.expander("Settings") as expander:
        settings["resolution"] = st.radio("Resolution", ["daily", "hourly"])

    ## refetch if filters changed
    data = fetch_data(filters, settings)

    ## make the charts
    charts = make_charts(data, filters)

    ## display
    col1, col2 = st.columns(2)

    with col1:
        st.plotly_chart(charts["cumulative_volume"], use_container_width=True)
        st.plotly_chart(charts["cumulative_liquidation"], use_container_width=True)
        st.plotly_chart(charts["cumulative_fees"], use_container_width=True)
        st.plotly_chart(charts["skew"], use_container_width=True)
        st.plotly_chart(charts["oi_usd"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["daily_volume"], use_container_width=True)
        st.plotly_chart(charts["daily_liquidation"], use_container_width=True)
        st.plotly_chart(charts["daily_fees"], use_container_width=True)
        st.plotly_chart(charts["funding_rate"], use_container_width=True)
        st.plotly_chart(charts["oi_pct"], use_container_width=True)

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
