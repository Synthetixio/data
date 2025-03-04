from os import path
from mage_ai.io.config import ConfigFileLoader
from mage_ai.settings.repo import get_repo_path

if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

import clickhouse_connect
import pandas as pd


@data_exporter
def export_data(data, *args, **kwargs):
    """
    Exports a Polars DataFrame to ClickHouse.

    Args:
        data: A Polars DataFrame to be exported to ClickHouse
        args: The output from any additional upstream blocks (if applicable)

    Output:
        Dictionary with export status and row count
    """

    TABLE_NAME = 'your_table_name'  # Replace with your target table name
    DATABASE_NAME = 'your_database'  # Replace with your database name
    
    config_path = path.join(get_repo_path(), 'io_config.yaml')
    config_profile = 'default'

    config = ConfigFileLoader(config_path, config_profile)
    username = config.get("CLICKHOUSE_HOST")
    password = config.get("CLICKHOUSE_PASSWORD")
    
    pandas_df = data.to_pandas()
    
    # Initialize ClickHouse client
    client = clickhouse_connect.get_client(
        host=CLICKHOUSE_HOST,
        user=CLICKHOUSE_USER,
        password=CLICKHOUSE_PASSWORD,
        secure=True
    )
    
    # Optional: Convert any datetime columns to pandas datetime format
    # Uncomment and modify the code below if you have datetime columns
    # datetime_columns = ['timestamp_col1', 'timestamp_col2']  # Replace with your datetime column names
    # for col in datetime_columns:
    #     if col in pandas_df.columns:
    #         pandas_df[col] = pd.to_datetime(pandas_df[col])
    
    client.insert_df(TABLE_NAME, pandas_df)
    row_count = len(pandas_df)
    print(f"Successfully exported {row_count} rows to {DATABASE_NAME}.{TABLE_NAME}")