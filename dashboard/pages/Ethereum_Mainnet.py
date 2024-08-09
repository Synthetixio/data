import streamlit as st
from modules.eth_mainnet import (
    core_stats,
)

st.set_page_config(page_title="Ethereum Mainnet", layout="wide")


pages = {
    "Core Stats": core_stats.main,
}
state_page = None
state_page = st.sidebar.radio(
    "Ethereum Mainnet",
    tuple(pages.keys()),
    index=tuple(pages.keys()).index(state_page) if state_page else 0,
)
pages[state_page]()
