import streamlit as st
from modules.all_chains import (
    core_stats,
    perp_stats,
)

st.set_page_config(page_title="All Chains", layout="wide")


pages = {
    "Core Stats": core_stats.main,
    "Perps Stats": perp_stats.main,
}
state_page = None
state_page = st.sidebar.radio(
    "All Chains",
    tuple(pages.keys()),
    index=tuple(pages.keys()).index(state_page) if state_page else 0,
)
pages[state_page]()
