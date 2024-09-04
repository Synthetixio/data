import streamlit as st
from modules.arbitrum_sepolia import (
    core_stats,
    spot_markets,
    perp_account,
    perp_integrators,
    perp_keepers,
    perp_markets,
    perp_monitor,
    perp_stats,
)

st.set_page_config(page_title="Arbitrum Sepolia", layout="wide")


pages = {
    "Perps Stats": perp_stats.main,
    "Perps Markets": perp_markets.main,
    "Perps Monitor": perp_monitor.main,
    "Core Stats": core_stats.main,
    "Spot Markets": spot_markets.main,
    "Perps Integrators": perp_integrators.main,
    "Perps Accounts": perp_account.main,
    "Perps Keepers": perp_keepers.main,
}
state_page = None
state_page = st.sidebar.radio(
    ":large_blue_circle: :test_tube: Arbitrum Sepolia",
    tuple(pages.keys()),
    index=tuple(pages.keys()).index(state_page) if state_page else 0,
)
pages[state_page]()
