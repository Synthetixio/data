import streamlit as st
import pandas as pd
import sqlite3
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_many_lines, chart_many_bars, chart_many_pct, export_data
from utils import get_connection, get_v2_markets

## set default filters
filters = {
    "start_date": datetime.today().date() - timedelta(days=14),
    "end_date": datetime.today().date(),
}

## set default settings
settings = {"resolution": "daily"}


## data
@st.cache_data(ttl=1)
def fetch_data(filters, settings):
    # get settings
    resolution = settings["resolution"]

    # initialize connection
    db = get_connection()

    df_integrator_stats_agg = pd.read_sql_query(
        f"""
        SELECT
            ts,
            case when tracking_code in (NULL, '', '`') then 'No tracking code' else tracking_code end as tracking_code,
            exchange_fees,
            volume,
            trades,
            traders,
            cumulative_exchange_fees,
            cumulative_volume,
            cumulative_trades
        FROM optimism_mainnet.fct_v2_integrator_{resolution}
        where ts >= '{filters["start_date"]}'
            and ts <= '{filters["end_date"]}'
        order by ts
    """,
        db,
    )

    return {
        "integrator_stats_agg": df_integrator_stats_agg,
    }


## charts
@st.cache_data(ttl=300)
def make_charts(data, filters, settings):
    df = data["integrator_stats_agg"]
    return {
        "volume": chart_many_bars(
            df,
            "ts",
            ["volume"],
            "Volume",
            "tracking_code",
        ),
        "volume_pct": chart_many_pct(
            df,
            "ts",
            ["volume"],
            "Volume %",
            "tracking_code",
        ),
        "exchange_fees": chart_many_bars(
            df,
            "ts",
            ["exchange_fees"],
            "Exchange Fees",
            "tracking_code",
        ),
        "exchange_fees_pct": chart_many_pct(
            df,
            "ts",
            ["exchange_fees"],
            "Exchange Fees %",
            "tracking_code",
        ),
        "trades": chart_many_bars(
            df,
            "ts",
            ["trades"],
            "Trades",
            "tracking_code",
        ),
        "trades_pct": chart_many_pct(
            df,
            "ts",
            ["trades"],
            "Trades %",
            "tracking_code",
        ),
        "traders": chart_many_bars(
            df,
            "ts",
            ["traders"],
            "Traders",
            "tracking_code",
        ),
        "cumulative_volume": chart_many_lines(
            df,
            "ts",
            ["cumulative_volume"],
            "Cumulative Volume",
            "tracking_code",
        ),
        "cumulative_exchange_fees": chart_many_lines(
            df,
            "ts",
            ["cumulative_exchange_fees"],
            "Cumulative Exchange Fees",
            "tracking_code",
        ),
        "cumulative_trades": chart_many_lines(
            df,
            "ts",
            ["cumulative_trades"],
            "Cumulative Trades",
            "tracking_code",
        ),
    }


def main():
    ## inputs
    filt_col1, filt_col2 = st.columns(2)
    with filt_col1:
        filters["start_date"] = st.date_input("Start", filters["start_date"])

    with filt_col2:
        filters["end_date"] = st.date_input("End", filters["end_date"])

    with st.expander("Settings") as expander:
        settings["resolution"] = st.radio("Resolution", ["daily", "hourly"])

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
        st.plotly_chart(charts["traders"], use_container_width=True)
        st.plotly_chart(charts["cumulative_volume"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["volume_pct"], use_container_width=True)
        st.plotly_chart(charts["exchange_fees_pct"], use_container_width=True)
        st.plotly_chart(charts["trades_pct"], use_container_width=True)
        st.plotly_chart(charts["cumulative_exchange_fees"], use_container_width=True)
        st.plotly_chart(charts["cumulative_trades"], use_container_width=True)

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])


## old
# def main():
#     df = fetch_data()

#     ## get list of assets sorted alphabetically
#     assets = df["asset"].unique()
#     assets.sort()

#     ## inputs
#     filt_col1, filt_col2 = st.columns(2)
#     with filt_col1:
#         start_date = st.date_input(
#             "Start", datetime.today().date() - timedelta(days=30)
#         )

#     with filt_col2:
#         end_date = st.date_input("End", datetime.today().date())

#     with st.expander("Filter markets"):
#         assets_filter = st.multiselect("Select markets", assets, default=assets)

#     ## filter the data
#     df, df_daily = filter_data(df, start_date, end_date, assets_filter)

#     ## make the charts
#     charts = make_charts(df, df_daily)

#     ## display

#     col1, col2 = st.columns(2)
#     with col1:
#         st.plotly_chart(charts["volume_cumulative"], use_container_width=True)
#         st.plotly_chart(charts["trades_cumulative"], use_container_width=True)
#         st.plotly_chart(charts["fees"], use_container_width=True)
#         st.plotly_chart(charts["volume"], use_container_width=True)
#         st.plotly_chart(charts["trades"], use_container_width=True)
#         st.plotly_chart(charts["traders"], use_container_width=True)

#     with col2:
#         st.plotly_chart(charts["fees_cumulative"], use_container_width=True)
#         st.plotly_chart(charts["traders_cumulative"], use_container_width=True)
#         st.plotly_chart(charts["fees_pct"], use_container_width=True)
#         st.plotly_chart(charts["volume_pct"], use_container_width=True)
#         st.plotly_chart(charts["trades_pct"], use_container_width=True)

#     ## export
#     exports = [
#         {
#             "title": "Daily Data",
#             "df": df_daily,
#         }
#     ]
#     with st.expander("Exports"):
#         for export in exports:
#             export_data(export["title"], export["df"])
