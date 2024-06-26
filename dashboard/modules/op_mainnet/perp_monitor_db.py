import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_many_bars, export_data
from utils import chart_bars, chart_many_bars, export_data
from utils import get_connection, get_v2_markets

## set default filters
filters = {
    "start_date": datetime.today().date() - timedelta(days=3),
    "end_date": datetime.today().date(),
}

## set default settings
settings = {"resolution": "hourly"}


## data
@st.cache_data(ttl=1)
def fetch_data(filters, settings):
    # get settings
    resolution = settings["resolution"]

    # initialize connection
    db = get_connection()

    df_market_stats_agg = pd.read_sql_query(
        f"""
        SELECT
            ts,
            market,
            exchange_fees,
            liquidation_fees,
            volume,
            amount_liquidated,
            trades,
            liquidations,
            cumulative_volume,
            cumulative_exchange_fees,
            cumulative_liquidation_fees,
            cumulative_amount_liquidated,
            long_oi_usd,
            short_oi_usd,
            total_oi_usd
        FROM prod_optimism_mainnet.fct_v2_market_{resolution}_optimism_mainnet
        where ts >= '{filters["start_date"]}'
            and ts <= '{filters["end_date"]}'
        order by ts
    """,
        db,
    )

    db.close()

    return {
        "market_stats_agg": df_market_stats_agg,
    }


## charts
@st.cache_data(ttl=300)
def make_charts(data, filters, settings):
    df = data["market_stats_agg"][
        data["market_stats_agg"]["market"].isin(filters["markets"])
    ]

    return {
        "volume": chart_many_bars(
            df,
            "ts",
            ["volume"],
            "Volume",
            "market",
        ),
        # "pnl": chart_many_bars(
        #     data["market_stats_agg"],
        #     "date_hour",
        #     ["staker_pnl"],
        #     "Staker Pnl",
        #     "market",
        # ),
        "exchange_fees": chart_many_bars(
            df,
            "ts",
            ["exchange_fees"],
            "Exchange Fees",
            "market",
        ),
        "liquidation_fees": chart_many_bars(
            df,
            "ts",
            ["liquidation_fees"],
            "Liquidation Fees",
            "market",
        ),
        "amount_liquidated": chart_many_bars(
            df,
            "ts",
            ["amount_liquidated"],
            "Amount Liquidated",
            "market",
        ),
        "trades": chart_many_bars(
            df,
            "ts",
            ["trades"],
            "Trades",
            "market",
        ),
        "liquidations": chart_many_bars(
            df,
            "ts",
            ["liquidations"],
            "Liquidations",
            "market",
        ),
    }


def main():
    ## get list of markets
    markets = get_v2_markets()
    markets = sorted(
        markets,
        key=lambda x: (x != "ETH", x != "BTC", x),
    )
    filters["markets"] = markets

    ## inputs
    filt_col1, filt_col2 = st.columns(2)
    with filt_col1:
        filters["start_date"] = st.date_input("Start", filters["start_date"])

    with filt_col2:
        filters["end_date"] = st.date_input("End", filters["end_date"])

    with st.expander("Filter markets"):
        filters["markets"] = st.multiselect("Select markets", markets, default=markets)

    with st.expander("Settings") as expander:
        settings["resolution"] = st.radio("Resolution", ["hourly", "daily"])

    ## refetch if filters changed
    data = fetch_data(filters, settings)

    ## make the charts
    charts = make_charts(data, filters, settings)

    ## display
    col1, col2 = st.columns(2)

    with col1:
        st.plotly_chart(charts["volume"], use_container_width=True)
        st.plotly_chart(charts["exchange_fees"], use_container_width=True)
        st.plotly_chart(charts["trades"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["amount_liquidated"], use_container_width=True)
        st.plotly_chart(charts["liquidation_fees"], use_container_width=True)
        st.plotly_chart(charts["liquidations"], use_container_width=True)

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
