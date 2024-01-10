import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import datetime, timedelta
from utils import chart_lines, chart_many_bars, export_data
from utils import get_connection


## data
@st.cache_data(ttl=1)
def fetch_data():
    # initialize connection
    db = get_connection()

    # read data
    df_keeper_hourly = pd.read_sql_query(
        "SELECT * FROM base_mainnet.fct_perp_keeper_stats_hourly order by ts", db
    )
    df_keeper_daily = pd.read_sql_query(
        "SELECT * FROM base_mainnet.fct_perp_keeper_stats_daily order by ts", db
    )

    db.close()

    return {
        "keeper_hourly": df_keeper_hourly,
        "keeper_daily": df_keeper_daily,
    }


## charts
def make_charts(data, settings):
    df = data[f"keeper_{settings['resolution']}"]

    return {
        "trades": chart_many_bars(df, "ts", ["trades"], "Orders Settled", "keeper"),
        "trades_pct": chart_many_bars(
            df, "ts", ["trades_pct"], "Orders Settled %", "keeper"
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
        ),
    }


def main():
    ## fetch data
    data = fetch_data()

    ## title
    st.markdown("## Perps V3 Keepers")

    ## inputs
    with st.expander("Settings") as expander:
        resolution = st.radio("Resolution", ["daily", "hourly"])

        settings = {"resolution": resolution}

    ## make the charts
    charts = make_charts(data, settings)

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
