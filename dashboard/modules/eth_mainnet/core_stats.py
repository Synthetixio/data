import streamlit as st
import pandas as pd
from datetime import datetime, timedelta
from utils import get_connection
from utils import chart_bars, chart_lines, export_data

## set default filters
filters = {
    "start_date": datetime.today().date() - timedelta(days=14),
    "end_date": datetime.today().date() + timedelta(days=1),
    "resolution": "24h",
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
    df_account_delegation = pd.read_sql_query(
        f"""
        SELECT * FROM prod_eth_mainnet.fct_core_account_delegation_eth_mainnet
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
    """,
        db,
    )

    df_apr = pd.read_sql_query(
        f"""
        SELECT 
            ts,
            coalesce(tk.token_symbol, collateral_type) as collateral_type,
            collateral_value,
            debt,
            hourly_pnl,
            rewards_usd,
            hourly_issuance,
            cumulative_issuance,
            cumulative_pnl,
            apr_{resolution} as apr,
            apr_{resolution}_pnl as apr_pnl,
            apr_{resolution}_rewards as apr_rewards
        FROM prod_eth_mainnet.fct_core_apr_eth_mainnet apr
        LEFT JOIN prod_seeds.eth_mainnet_tokens tk on lower(apr.collateral_type) = lower(tk.token_address)
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        and pool_id = 1
        ORDER BY ts
    """,
        db,
    )

    df_apr_token = pd.read_sql_query(
        f"""
        SELECT 
            ts,
            coalesce(tk.token_symbol, collateral_type) as collateral_type,
            apr.reward_token,
            concat(coalesce(tk.token_symbol, collateral_type), ' : ', apr.reward_token) as token_pair,
            collateral_value,
            rewards_usd,
            apr_{resolution}_rewards as apr_rewards
        FROM prod_eth_mainnet.fct_core_apr_rewards_eth_mainnet apr
        LEFT JOIN prod_seeds.eth_mainnet_tokens tk on lower(apr.collateral_type) = lower(tk.token_address)
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        and pool_id = 1
        and apr.reward_token is not null
        ORDER BY ts
    """,
        db,
    )

    db.close()

    return {
        "account_delegation": df_account_delegation,
        "apr": df_apr,
        "apr_token": df_apr_token,
    }


def make_charts(data, filters):
    resolution = filters["resolution"]
    return {
        "tvl": chart_lines(
            data["apr"],
            "ts",
            ["collateral_value"],
            "TVL",
            "collateral_type",
        ),
        "debt": chart_lines(
            data["apr"],
            "ts",
            ["debt"],
            "Debt",
            "collateral_type",
        ),
        "hourly_issuance": chart_bars(
            data["apr"],
            "ts",
            ["hourly_issuance"],
            "Hourly Issuance",
            "collateral_type",
        ),
        "issuance": chart_lines(
            data["apr"],
            "ts",
            ["cumulative_issuance"],
            "Issuance",
            "collateral_type",
        ),
        "pnl": chart_lines(
            data["apr"],
            "ts",
            ["cumulative_pnl"],
            "Pnl",
            "collateral_type",
        ),
        "hourly_pnl": chart_bars(
            data["apr"],
            "ts",
            ["hourly_pnl"],
            "Hourly Pnl",
            "collateral_type",
        ),
        "hourly_rewards": chart_bars(
            data["apr"],
            "ts",
            ["rewards_usd"],
            "Hourly Rewards",
            "collateral_type",
        ),
        "hourly_rewards_token": chart_bars(
            data["apr_token"],
            "ts",
            ["rewards_usd"],
            "Hourly Rewards (Collateral : Reward)",
            "token_pair",
        ),
        "apr": chart_lines(
            data["apr"],
            "ts",
            "apr",
            f"APR - {resolution} average",
            y_format="%",
            color="collateral_type",
        ),
        "apr_token": chart_lines(
            data["apr_token"],
            "ts",
            "apr_rewards",
            f"Reward APR by Token - {resolution} average",
            y_format="%",
            color="token_pair",
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
        st.plotly_chart(charts["tvl"], use_container_width=True)
        st.plotly_chart(charts["hourly_pnl"], use_container_width=True)
        st.plotly_chart(charts["hourly_issuance"], use_container_width=True)
        st.plotly_chart(charts["hourly_rewards"], use_container_width=True)
        st.plotly_chart(charts["apr_token"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["debt"], use_container_width=True)
        st.plotly_chart(charts["pnl"], use_container_width=True)
        st.plotly_chart(charts["issuance"], use_container_width=True)
        st.plotly_chart(charts["hourly_rewards_token"], use_container_width=True)

    st.markdown("## Top Delegators")
    st.dataframe(
        data["account_delegation"]
        .sort_values("amount_delegated", ascending=False)
        .head(25)
    )

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
