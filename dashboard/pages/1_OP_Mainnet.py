import streamlit as st
from modules.op_mainnet import (
    perp_stats,
    perp_markets,
    perp_integrators,
    perp_monitor,
    perp_stats_db,
    perp_markets_db,
    perp_monitor_db,
)

st.set_page_config(page_title="OP Mainnet", layout="wide")

pages = {
    "Perps V2 Stats DB": perp_stats_db.main,
    "Perps V2 Markets DB": perp_markets_db.main,
    "Perps V2 Monitor DB": perp_monitor_db.main,
    "Perps V2 Integrators": perp_integrators.main,
    "Perps V2 Monitor": perp_monitor.main,
}
state_page = None
state_page = st.sidebar.radio(
    ":red_circle: OP Mainnet",
    tuple(pages.keys()),
    index=tuple(pages.keys()).index(state_page) if state_page else 0,
)
pages[state_page]()
