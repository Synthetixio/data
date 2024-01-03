import streamlit as st

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
