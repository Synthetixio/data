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


@st.cache_resource(ttl=600)
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


@st.cache_data(ttl=600)
def get_v2_markets():
    # initialize connection
    db = get_connection()

    df_markets = pd.read_sql_query(
        f"""
        SELECT distinct market FROM optimism_mainnet.fct_v2_market_stats
    """,
        db,
    )

    return df_markets["market"].unique().tolist()
