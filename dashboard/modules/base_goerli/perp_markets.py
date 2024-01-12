import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_market_bars, chart_market_lines, chart_market_oi, export_data
from utils import get_connection


## data
@st.cache_data(ttl=1)
def fetch_data():
    # initialize connection
    db = get_connection()

    # read data
    df_market_history = pd.read_sql_query(
        "SELECT * FROM base_goerli.fct_perp_market_history order by ts", db
    )

    return {
        "market_history": df_market_history,
    }


## charts
def make_charts(data, asset):
    return {
        "funding": chart_market_lines(
            data["market_history"],
            asset,
            "ts",
            ["funding_rate"],
            "Funding Rate",
        ),
        "price": chart_market_lines(
            data["market_history"], asset, "ts", ["price"], "Price"
        ),
        "skew": chart_market_lines(
            data["market_history"], asset, "ts", ["skew"], "Market Skew"
        ),
        "oi": chart_market_lines(
            data["market_history"], asset, "ts", ["size_usd"], "Open Interest $"
        ),
        "oi_pct": chart_market_oi(data["market_history"], asset),
    }


def main():
    ## fetch data
    data = fetch_data()

    ## inputs
    st.markdown("## Perps V3 Markets")
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
