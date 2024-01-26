import streamlit as st
from st_pages import Page, show_pages, add_page_title

st.set_page_config(page_title="Synthetix Dashboards", layout="wide")

hide_footer = """
    <style>
        footer {visibility: hidden;}
    </style>
"""
st.markdown(hide_footer, unsafe_allow_html=True)

st.write("# Synthetix Dashboards")

st.markdown(
    """
Use the sidebar to select a chain. The dashboard selector will appear below.
"""
)

# page setup
home_page = [Page("pages/Home.py", "Home")]
op_pages = [
    Page("pages/OP_Mainnet.py", "OP Mainnet"),
]
base_pages = [
    Page("pages/Base_Mainnet.py", "Base Mainnet"),
    Page("pages/Base_Sepolia.py", "Base Sepolia"),
]

# pages to show
SHOW_OP = st.secrets.settings.SHOW_OP

pages_to_show = home_page + (op_pages if SHOW_OP == "true" else []) + base_pages
show_pages(pages_to_show)
