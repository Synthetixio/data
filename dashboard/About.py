import streamlit as st
from st_pages import Page, show_pages, add_page_title

st.set_page_config(page_title="Synthetix Dashboards", layout="wide")

hide_footer = """
    <style>
        footer {visibility: hidden;}
    </style>
"""
st.markdown(hide_footer, unsafe_allow_html=True)

st.markdown(
    """
# Synthetix V3 Analytics

Find the latest data and insights on the Synthetix V3 ecosystem.

## Base Andromeda

The Andromeda release of Synthetix is a deployment of the V3 Core and Perps contracts on the Base network. Users can provide liquidity using USDC and easily trade perps using USDC as collateral. For a more detailed overview read this [blog post](https://blog.synthetix.io/what-is-the-andromeda-release/).


#### Available Dashboards:
- **Perps Markets**: An overview of each perps market including volume, fees, and more.
- **Perps Monitor**: An overview of all perps markets providing a simple way to monitor all markets at a glance.
- **Core Stats**: An overview of the Core system including debt, collateral, LP pnl, and more.
- **Spot Markets**: Tracking the USDC wrapper contracts.
- **Perps Integrators**: An overview of the perp market activity by integrator.
- **Perps Accounts**: A dashboard allowing you to specify an account and view their recent activity.
- **Perps Keepers**: An overview of settlement trasactions to track activity of community keepers.

## Other Resources
- Learn about V3 in the [documentation](https://docs.synthetix.io/v/v3/)
- Read updates and announcements on the [blog](https://blog.synthetix.io/)
- Join the community on [discord](https://discord.com/invite/AEdUHzt)
"""
)

# page setup
PAGE_PREFIX = "dashboard/" if st.secrets.settings.IS_CLOUD == "true" else ""
SHOW_OP = True if st.secrets.settings.SHOW_OP == "true" else False

home_page = [Page(f"{PAGE_PREFIX}About.py", "About")]
op_pages = [
    Page(f"{PAGE_PREFIX}pages/OP_Mainnet.py", "OP Mainnet"),
]
base_pages = [
    Page(f"{PAGE_PREFIX}pages/Base_Mainnet.py", "Base Mainnet"),
    Page(f"{PAGE_PREFIX}pages/Base_Sepolia.py", "Base Sepolia"),
]

# pages to show
pages_to_show = home_page + (op_pages if SHOW_OP else []) + base_pages
show_pages(pages_to_show)
