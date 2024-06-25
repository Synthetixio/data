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

    df_collateral = pd.read_sql_query(
        f"""
        SELECT 
            ts,
            CONCAT(coalesce(tk.token_symbol, collateral_type), ' (Arbitrum)') as label,
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
        FROM arbitrum_mainnet.fct_core_apr apr
        LEFT JOIN arbitrum_mainnet.arbitrum_mainnet_tokens tk on lower(apr.collateral_type) = lower(tk.token_address)
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        
        UNION ALL
        
        SELECT 
            ts,
            CONCAT(coalesce(tk.token_symbol, collateral_type), ' (Base)') as label,
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
        FROM base_mainnet.fct_core_apr apr
        LEFT JOIN base_mainnet.base_mainnet_tokens tk on lower(apr.collateral_type) = lower(tk.token_address)
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        
        ORDER BY ts
    """,
        db,
    )

    df_chain = pd.read_sql_query(
        f"""
        SELECT 
            ts,
            'Arbitrum' as label,
            collateral_value,
            cumulative_pnl
        FROM arbitrum_mainnet.fct_core_apr apr
        LEFT JOIN arbitrum_mainnet.arbitrum_mainnet_tokens tk on lower(apr.collateral_type) = lower(tk.token_address)
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        
        UNION ALL
        
        SELECT 
            ts,
            'Base' as label,
            collateral_value,
            cumulative_pnl
        FROM base_mainnet.fct_core_apr apr
        LEFT JOIN base_mainnet.base_mainnet_tokens tk on lower(apr.collateral_type) = lower(tk.token_address)
        WHERE ts >= '{start_date}' and ts <= '{end_date}'
        
        ORDER BY ts
    """,
        db,
    )

    db.close()

    return {
        "collateral": df_collateral,
        "chain": df_chain,
    }


def make_charts(data, filters):
    resolution = filters["resolution"]
    return {
        "tvl_collateral": chart_lines(
            data["collateral"],
            "ts",
            ["collateral_value"],
            "TVL by Collateral",
            "label",
        ),
        "pnl_collateral": chart_lines(
            data["collateral"],
            "ts",
            ["cumulative_pnl"],
            "Cumulative Pnl by Collateral",
            "label",
        ),
        "apr": chart_lines(
            data["collateral"],
            "ts",
            "apr",
            f"APR - {resolution} average",
            y_format="%",
            color="label",
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
        st.plotly_chart(charts["tvl_collateral"], use_container_width=True)

    with col2:
        st.plotly_chart(charts["pnl_collateral"], use_container_width=True)

    ## export
    exports = [{"title": export, "df": data[export]} for export in data.keys()]
    with st.expander("Exports"):
        for export in exports:
            export_data(export["title"], export["df"])
