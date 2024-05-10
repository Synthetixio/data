import streamlit as st
from modules.milestones import (
    base_andromeda,
)

st.set_page_config(page_title="Milestones", layout="wide")


pages = {
    "Base Andromeda": base_andromeda.main,
}
state_page = None
state_page = st.sidebar.radio(
    "Synthetix Milestones",
    tuple(pages.keys()),
    index=tuple(pages.keys()).index(state_page) if state_page else 0,
)
pages[state_page]()
