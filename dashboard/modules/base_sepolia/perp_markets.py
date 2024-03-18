import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_lines, chart_oi, export_data
from utils import get_connection

## set default filters
filters = {
    "start_date": datetime.today().date() - timedelta(days=14),
    "end_date": datetime.today().date() + timedelta(days=1),
}


## data
@st.cache_data(ttl=1)
def fetch_data(filters):
    # get filters
    start_date = filters["start_date"]
    end_date = filters["end_date"]

    # initialize connection
    db = get_connection()

    # read data
    df_market_history = pd.read_sql_query(
        f"""
        SELECT
            ts,
            market_id,
            market_symbol,
            funding_rate,
            price,
            skew,
            size_usd,
            short_oi_pct,
            long_oi_pct
        FROM base_sepolia.fct_perp_market_history
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        ORDER BY ts
        """,
        db,
    )

    db.close()

    return {
        "market_history": df_market_history,
    }


## charts
def make_charts(data, asset):
    df = data["market_history"][data["market_history"]["market_symbol"] == asset]

    return {
        "funding": chart_lines(
            df,
            "ts",
            ["funding_rate"],
            "Funding Rate per 24 hours",
            smooth=True,
            y_format="%",
        ),
        "price": chart_lines(
            df,
            "ts",
            ["price"],
            "Price",
            smooth=True,
        ),
        "skew": chart_lines(
            df,
            "ts",
            ["skew"],
            "Market Skew",
            y_format="#",
        ),
        "oi": chart_lines(
            df,
            "ts",
            ["size_usd"],
            "Open Interest: Total",
        ),
        "oi_pct": chart_oi(
            df,
            "ts",
            "Open Interest: Long vs Short",
        ),
    }


def main():
    ## title
    st.markdown("## V3 Perps Markets")

    ## inputs
    with st.expander("Filters") as expander:
        # date filter
        filt_col1, filt_col2 = st.columns(2)
        with filt_col1:
            filters["start_date"] = st.date_input("Start", filters["start_date"])

        with filt_col2:
            filters["end_date"] = st.date_input("End", filters["end_date"])

    ## fetch data
    data = fetch_data(filters)

    ## market filter
    assets = sorted(
        data["market_history"]["market_symbol"].unique(),
        key=lambda x: (x != "ETH", x != "BTC", x),
    )
    asset = st.selectbox("Select asset", assets, index=0)

    ## make the charts
    charts = make_charts(data, asset)

    ## display
    st.plotly_chart(charts["price"], use_container_width=True)

    col1, col2 = st.columns(2)
    with col1:
        st.plotly_chart(charts["oi"], use_container_width=True)
        st.plotly_chart(charts["skew"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["oi_pct"], use_container_width=True)
        st.plotly_chart(charts["funding"], use_container_width=True)

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
