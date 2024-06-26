import streamlit as st
import pandas as pd
from datetime import datetime, timedelta
from utils import get_connection
from .charts import chart_volume, chart_collateral


## data
@st.cache_data(ttl=600)
def fetch_data():
    # set filters
    start_date = datetime.today().date() - timedelta(days=28)
    end_date = datetime.today().date() + timedelta(days=1)

    # initialize connection
    db = get_connection()

    # read data
    df_stats = pd.read_sql_query(
        f"""
        SELECT
            ts,
            volume,
            cumulative_volume            
        FROM prod_base_mainnet.fct_perp_stats_daily_base_mainnet
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        ORDER BY ts
        """,
        db,
    )

    df_collateral = pd.read_sql_query(
        f"""
        SELECT
            ts,
            pool_id,
            collateral_type,
            amount,
            collateral_value
        FROM prod_base_mainnet.core_vault_collateral_base_mainnet
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        ORDER BY ts
        """,
        db,
    )

    # data transformations
    # add 7 day rolling volume average for volume field
    df_stats["volume_7d"] = df_stats["volume"].rolling(window=7).mean()

    db.close()

    return {
        "stats": df_stats,
        "collateral": df_collateral,
    }


def make_charts(data):
    return {
        "volume": chart_volume(data["stats"]),
        "collateral": chart_collateral(data["collateral"]),
    }


def main():
    ## title
    st.markdown(
        """
## **Scale Base Andromeda**

Measuring progress toward Synthetix's milestones on Base.

1. Perps to \$100M daily volume
2. \$10M LP collateral.
    """
    )

    ## fetch data
    data = fetch_data()

    ## make the charts
    charts = make_charts(data)

    st.plotly_chart(charts["volume"], use_container_width=True)
    st.plotly_chart(charts["collateral"], use_container_width=True)
