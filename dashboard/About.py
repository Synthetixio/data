import streamlit as st
from st_pages import Page, show_pages, add_page_title

st.set_page_config(
    page_title="Synthetix Dashboards",
    page_icon="./static/favicon.ico",
    layout="wide",
)

hide_footer = """
    <style>
        footer {visibility: hidden;}
    </style>
"""
st.markdown(hide_footer, unsafe_allow_html=True)

st.markdown(
    """

# Synthetix V3 Analytics

Discover the latest insights into the Synthetix V3 ecosystem.

## Base Andromeda Release

Andromeda, the latest Synthetix V3 deployment on the Base network, allows liquidity provision with USDC and seamless trading of perps using USDC collateral. For details, explore our [blog post](https://blog.synthetix.io/what-is-the-andromeda-release/).

### Dashboards:
- **Perps Stats**: Insights on volume, fees, and more across all markets.
- **Perps Markets**: Insights for each perps market.
- **Perps Monitor**: A consolidated view of all perps markets.
- **Core Stats**: Key metrics of the Core system, including debt, collateral, and LP performance.
- **Spot Markets**: Analysis of the USDC wrapper contracts.
- **Perps Integrators**: Activity overview by integrator.
- **Perps Accounts**: View recent activity by specific accounts.
- **Perps Keepers**: Track community keepers' settlement transactions.

## Additional Resources
- V3 details: [documentation](https://docs.synthetix.io/v/v3/)
- Updates: [blog](https://blog.synthetix.io/)
- Community: [discord](https://discord.com/invite/AEdUHzt)
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
