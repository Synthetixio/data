import streamlit as st
import pandas as pd
from datetime import datetime, timedelta
from utils import get_connection
from utils import chart_bars, chart_lines, export_data

## set default filters
filters = {
    "start_date": datetime.today().date() - timedelta(days=14),
    "end_date": datetime.today().date() + timedelta(days=1),
    "resolution": "28d",
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

    # get account data
    df_collateral = pd.read_sql_query(
        f"""
        SELECT ts, pool_id, collateral_type, amount, collateral_value FROM base_sepolia.core_vault_collateral
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        order by ts
    """,
        db,
    )

    df_debt = pd.read_sql_query(
        f"""
        SELECT ts, pool_id, collateral_type, debt FROM base_sepolia.core_vault_debt
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        order by ts
    """,
        db,
    )

    df_account_delegation = pd.read_sql_query(
        f"""
        SELECT * FROM base_sepolia.fct_core_account_delegation
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
    """,
        db,
    )

    df_market_updated = pd.read_sql_query(
        f"""
        SELECT * FROM base_sepolia.fct_core_market_updated
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        ORDER BY ts
    """,
        db,
    )

    df_pnl = pd.read_sql_query(
        f"""
        SELECT *, concat(pool_id, '-', collateral_type) as "pool" FROM base_sepolia.fct_pool_pnl
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        and pool_id = 1
        ORDER BY ts
    """,
        db,
    )

    df_apr = pd.read_sql_query(
        f"""
        SELECT 
            ts,
            concat(pool_id, '-', collateral_type) as "pool",
            hourly_pnl,
            apr_{resolution} as apr,
            apr_{resolution}_pnl as apr_pnl,
            apr_{resolution}_rewards as apr_rewards
        FROM base_sepolia.fct_core_apr
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        and pool_id = 1
        ORDER BY ts
    """,
        db,
    )

    return {
        "collateral": df_collateral,
        "debt": df_debt,
        "account_delegation": df_account_delegation,
        "market_updated": df_market_updated,
        "pnl": df_pnl,
        "apr": df_apr,
    }


def make_charts(data, filters):
    resolution = filters["resolution"]
    return {
        "collateral": chart_lines(
            data["collateral"],
            "ts",
            ["collateral_value"],
            "Collateral",
            "collateral_type",
        ),
        "debt": chart_lines(
            data["debt"],
            "ts",
            ["debt"],
            "Debt",
            "collateral_type",
        ),
        "net_issuance": chart_lines(
            data["market_updated"],
            "ts",
            ["net_issuance"],
            "Net Issuance",
            "market_id",
        ),
        "pnl": chart_lines(
            data["pnl"],
            "ts",
            ["market_pnl"],
            "Pnl",
            "pool",
        ),
        "hourly_pnl": chart_bars(
            data["apr"],
            "ts",
            ["hourly_pnl"],
            "Hourly Pnl",
        ),
        "apr": chart_lines(
            data["apr"],
            "ts",
            ["apr", "apr_pnl", "apr_rewards"],
            f"APR - {resolution} average",
            y_format="%",
        ),
    }


def main():
    ## title
    st.markdown("## V3 Core")

    ## inputs
    with st.expander("Filters"):
        filters["resolution"] = st.radio(
            "Resolution",
            ["28d", "7d", "24h"],
        )

        filt_col1, filt_col2 = st.columns(2)
        with filt_col1:
            filters["start_date"] = st.date_input("Start", filters["start_date"])

        with filt_col2:
            filters["end_date"] = st.date_input("End", filters["end_date"])

    data = fetch_data(filters)

    ## make the charts
    charts = make_charts(data, filters)

    ## display
    st.plotly_chart(charts["apr"], use_container_width=True)

    col1, col2 = st.columns(2)
    with col1:
        st.plotly_chart(charts["collateral"], use_container_width=True)
        st.plotly_chart(charts["net_issuance"], use_container_width=True)
        st.plotly_chart(charts["hourly_pnl"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["debt"], use_container_width=True)
        st.plotly_chart(charts["pnl"], use_container_width=True)

    st.markdown("## Top Delegators")
    st.dataframe(
        data["account_delegation"]
        .sort_values("amount_delegated", ascending=False)
        .head(25)
    )

    st.markdown("## Markets")

    st.markdown("### sUSDC Market")
    st.dataframe(
        data["market_updated"][data["market_updated"]["market_id"] == 1]
        .sort_values("ts", ascending=False)
        .head(25)
    )

    st.markdown("### Perps Markets")
    st.dataframe(
        data["market_updated"][data["market_updated"]["market_id"] == 2]
        .sort_values("ts", ascending=False)
        .head(25)
    )

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
