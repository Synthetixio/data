import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import get_connection
from utils import chart_bars, chart_lines, export_data

## set default filters
filters = {
    "start_date": datetime.today().date() - timedelta(days=14),
    "end_date": datetime.today().date() + timedelta(days=1),
    "resolution": "daily",
}


## data
@st.cache_data(ttl=600)
def fetch_data(filters):
    # get filters
    start_date = filters["start_date"]
    end_date = filters["end_date"]
    resolution = filters["resolution"]

    # initialize connection
    db = get_connection()

    # read data
    df_stats = pd.read_sql_query(
        f"""
        SELECT
            ts,
            volume,
            trades,
            exchange_fees,
            liquidated_accounts,
            liquidation_rewards,
            cumulative_exchange_fees,
            cumulative_volume            
        FROM {st.secrets.database.DB_ENV}_base_sepolia.fct_perp_stats_{resolution}_base_sepolia
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        """,
        db,
    )

    df_buyback = pd.read_sql_query(
        f"""
        SELECT
            ts,
            snx_amount,
            usd_amount,
            cumulative_snx_amount,
            cumulative_usd_amount
        FROM {st.secrets.database.DB_ENV}_base_sepolia.fct_buyback_{resolution}_base_sepolia
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        """,
        db,
    )

    db.close()

    return {
        "stats": df_stats,
        "buyback": df_buyback,
    }


def make_charts(data):
    return {
        "volume": chart_bars(data["stats"], "ts", ["volume"], "Volume"),
        "cumulative_volume": chart_lines(
            data["stats"],
            "ts",
            ["cumulative_volume"],
            "Cumulative Volume",
            smooth=True,
        ),
        "cumulative_fees": chart_lines(
            data["stats"],
            "ts",
            ["cumulative_exchange_fees"],
            "Cumulative Fees",
            smooth=True,
        ),
        "fees": chart_bars(
            data["stats"],
            "ts",
            ["exchange_fees"],
            "Exchange Fees",
        ),
        "trades": chart_bars(
            data["stats"],
            "ts",
            ["trades"],
            "Trades",
            y_format="#",
        ),
        "account_liquidations": chart_bars(
            data["stats"],
            "ts",
            ["liquidated_accounts"],
            "Account Liquidations",
            y_format="#",
        ),
        "liquidation_rewards": chart_bars(
            data["stats"],
            "ts",
            ["liquidation_rewards"],
            "Liquidation Rewards",
        ),
        "buyback": chart_bars(
            data["buyback"],
            "ts",
            ["snx_amount"],
            "SNX Buyback",
            y_format="#",
        ),
        "cumulative_buyback": chart_lines(
            data["buyback"],
            "ts",
            ["cumulative_snx_amount"],
            "Cumulative SNX Buyback",
            y_format="#",
            smooth=True,
        ),
    }


def main():
    ## title
    st.markdown("## V3 Perps Stats")

    ## inputs
    with st.expander("Filters") as expander:
        # resolution
        filters["resolution"] = st.radio("Resolution", ["daily", "hourly"])

        # date filter
        filt_col1, filt_col2 = st.columns(2)
        with filt_col1:
            filters["start_date"] = st.date_input("Start", filters["start_date"])

        with filt_col2:
            filters["end_date"] = st.date_input("End", filters["end_date"])

    ## fetch data
    data = fetch_data(filters)

    ## make the charts
    charts = make_charts(data)

    ## display
    col1, col2 = st.columns(2)

    with col1:
        st.plotly_chart(charts["cumulative_volume"], use_container_width=True)
        st.plotly_chart(charts["cumulative_fees"], use_container_width=True)
        st.plotly_chart(charts["account_liquidations"], use_container_width=True)
        st.plotly_chart(charts["liquidation_rewards"], use_container_width=True)
        st.plotly_chart(charts["cumulative_buyback"], use_container_width=True)
        pass

    with col2:
        st.plotly_chart(charts["volume"], use_container_width=True)
        st.plotly_chart(charts["fees"], use_container_width=True)
        st.plotly_chart(charts["trades"], use_container_width=True)
        st.plotly_chart(charts["buyback"], use_container_width=True)
        pass

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
