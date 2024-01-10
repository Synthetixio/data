import streamlit as st
import sqlalchemy
import pandas as pd

# Database connection parameters
DEFAULT_DB_CONFIG = {
    "dbname": "analytics",
    "user": "analytics",
    "password": "analytics",
    "host": "db",
    "port": 5432,
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
    st.write(df)
