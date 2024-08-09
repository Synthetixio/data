import streamlit as st
from st_pages import Page, show_pages, add_page_title

# page setup
PAGE_PREFIX = "dashboard/" if st.secrets.settings.IS_CLOUD == "true" else ""
SHOW_TESTNETS = True if st.secrets.settings.SHOW_TESTNETS == "true" else False

st.set_page_config(
    page_title="Synthetix Dashboards",
    page_icon=f"{PAGE_PREFIX}static/favicon.ico",
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

# Synthetix Stats

Discover the latest insights into the Synthetix ecosystem.

## Base Andromeda (V3)

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

## Optimism (V2)

Synthetix V2 offers perps trading on the Optimism network. These dashboards provide insights into the Perps V2 markets.

### Dashboards:
- **Perps Stats**: Insights on volume, fees, and more across all markets.
- **Perps Markets**: Insights for each perps market.
- **Perps Monitor**: A consolidated view of all perps markets.
- **Perps Integrators**: Activity overview by integrator.

## Additional Resources
- V3 details: [documentation](https://docs.synthetix.io/v/v3/)
- Updates: [blog](https://blog.synthetix.io/)
- Community: [discord](https://discord.com/invite/AEdUHzt)
"""
)

home_page = [
    Page(f"{PAGE_PREFIX}About.py", "About"),
    Page(f"{PAGE_PREFIX}pages/Milestones.py", "Milestones"),
]
mainnet_pages = [
    Page(f"{PAGE_PREFIX}pages/All_Chains.py", "All Chains"),
    Page(f"{PAGE_PREFIX}pages/Ethereum_Mainnet.py", "Ethereum"),
    Page(f"{PAGE_PREFIX}pages/Base_Mainnet.py", "Base"),
    Page(f"{PAGE_PREFIX}pages/Arbitrum_Mainnet.py", "Arbitrum"),
    Page(f"{PAGE_PREFIX}pages/Optimism_Mainnet.py", "Optimism"),
]
testnet_pages = [
    Page(f"{PAGE_PREFIX}pages/Base_Sepolia.py", "Base_Sepolia"),
    Page(f"{PAGE_PREFIX}pages/Arbitrum_Sepolia.py", "Arbitrum_Sepolia"),
]

# pages to show
pages_to_show = home_page + mainnet_pages + (testnet_pages if SHOW_TESTNETS else [])
show_pages(pages_to_show)
