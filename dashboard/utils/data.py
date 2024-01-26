import os
import streamlit as st
import sqlalchemy
import pandas as pd

# get the password from the environment
DB_NAME = st.secrets["DB_NAME"]
DB_USER = st.secrets["DB_USER"]
DB_PASS = st.secrets["DB_PASS"]
DB_HOST = st.secrets["DB_HOST"]
DB_PORT = st.secrets["DB_PORT"]

# Database connection parameters
DEFAULT_DB_CONFIG = {
    "dbname": DB_NAME,
    "user": DB_USER,
    "password": DB_PASS,
    "host": DB_HOST,
    "port": DB_PORT,
}


def get_connection(db_config=DEFAULT_DB_CONFIG):
    connection_string = f"postgresql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['dbname']}"
    engine = sqlalchemy.create_engine(connection_string)
    conn = engine.connect()
    return conn


def export_data(title, df):
    csv = df.to_csv(index=False).encode("utf-8")

    st.write(f"### {title}")
    st.download_button(
        f"Download CSV", csv, "export.csv", "text/csv", key=f"{title}-csv"
    )
    st.write(df.head(25))
