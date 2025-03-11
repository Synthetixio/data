import os
import clickhouse_connect
from mage_ai.io.config import ConfigFileLoader
from mage_ai.settings.repo import get_repo_path
from os import path

def get_client():
    """
    Get a ClickHouse client from Mage AI configuration

    Returns:
        clickhouse_connect.client.Client: ClickHouse client
    """
    config_path = path.join(get_repo_path(), 'io_config.yaml')
    config_profile = 'default'

    config = ConfigFileLoader(config_path, config_profile)
    host = config.get("CLICKHOUSE_HOST")
    password = 'Ut7_AgoUdg9Z9'
    username = 'default'

    # Initialize ClickHouse client
    client = clickhouse_connect.get_client(
        host=host,
        user=username,
        password=password,
        secure=True
    )

    return client

def ensure_database_exists(database):
    """
    Ensure the database exists in ClickHouse

    Args:
        database: Name of the database to create
    """
    client = get_client()
    client.query(f"CREATE DATABASE IF NOT EXISTS {database}")

def table_exists(table_name):
    """
    check wheather table exists or not

    Args:
        table_name: fully qualified table name
    """
    
    client = get_client()

    result = client.query(f'exists {table_name}').result_rows

    print(f"{table_name} exists : {result[0][0] == 1}")

    return result[0][0] == 1
