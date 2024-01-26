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
PAGE_PREFIX = "dashboard/" if st.secrets.settings.IS_CLOUD == "true" else ""
SHOW_OP = True if st.secrets.settings.SHOW_OP == "true" else False

home_page = [Page(f"{PAGE_PREFIX}network_pages/Home.py", "Home")]
op_pages = [
    Page(f"{PAGE_PREFIX}network_pages/OP_Mainnet.py", "OP Mainnet"),
]
base_pages = [
    Page(f"{PAGE_PREFIX}network_pages/Base_Mainnet.py", "Base Mainnet"),
    Page(f"{PAGE_PREFIX}network_pages/Base_Sepolia.py", "Base Sepolia"),
]

# pages to show
pages_to_show = home_page + (op_pages if SHOW_OP else []) + base_pages
show_pages(pages_to_show)
