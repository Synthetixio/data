import streamlit as st
from modules.base_mainnet import (
    perp_integrators,
    perp_monitor,
    perp_markets,
    spot_markets,
    perp_account,
    core_stats,
)

st.set_page_config(page_title="Base Mainnet", layout="wide")


pages = {
    "Perps Markets": perp_markets.main,
    "Perps Monitor": perp_monitor.main,
    "Core Stats": core_stats.main,
    "Spot Markets": spot_markets.main,
    "Perps Integrators": perp_integrators.main,
    "Perps Accounts": perp_account.main,
}
state_page = None
state_page = st.sidebar.radio(
    ":rocket: Base Mainnet",
    tuple(pages.keys()),
    index=tuple(pages.keys()).index(state_page) if state_page else 0,
)
pages[state_page]()
