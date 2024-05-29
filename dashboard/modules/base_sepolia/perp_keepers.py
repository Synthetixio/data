import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_lines, chart_many_bars, export_data
from utils import get_connection

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
    df_keeper = pd.read_sql_query(
        f"""
        SELECT
            ts,
            keeper,
            trades,
            trades_pct,
            amount_settled,
            amount_settled_pct,
            settlement_rewards,
            settlement_rewards_pct
        FROM base_sepolia.fct_perp_keeper_stats_{resolution}
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        ORDER BY ts
        """,
        db,
    )

    db.close()

    return {
        "keeper": df_keeper,
    }


## charts
def make_charts(data):
    df = data["keeper"]

    return {
        "trades": chart_many_bars(
            df,
            "ts",
            ["trades"],
            "Orders Settled",
            "keeper",
            y_format="#",
        ),
        "trades_pct": chart_many_bars(
            df,
            "ts",
            ["trades_pct"],
            "Orders Settled %",
            "keeper",
            y_format="%",
        ),
        "amount_settled": chart_many_bars(
            df,
            "ts",
            ["amount_settled"],
            "Notional Size Settled",
            "keeper",
        ),
        "amount_settled_pct": chart_many_bars(
            df,
            "ts",
            ["amount_settled_pct"],
            "Notional Size Settled %",
            "keeper",
            y_format="%",
        ),
        "settlement_rewards": chart_many_bars(
            df,
            "ts",
            ["settlement_rewards"],
            "Settlement Rewards",
            "keeper",
        ),
        "settlement_rewards_pct": chart_many_bars(
            df,
            "ts",
            ["settlement_rewards_pct"],
            "Settlement Rewards %",
            "keeper",
            y_format="%",
        ),
    }


def main():
    ## title
    st.markdown("## V3 Perps Keepers")

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
        st.plotly_chart(charts["trades"], use_container_width=True)
        st.plotly_chart(charts["amount_settled"], use_container_width=True)
        st.plotly_chart(charts["settlement_rewards"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["trades_pct"], use_container_width=True)
        st.plotly_chart(charts["amount_settled_pct"], use_container_width=True)
        st.plotly_chart(charts["settlement_rewards_pct"], use_container_width=True)

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
