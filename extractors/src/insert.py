import re
import clickhouse_connect
from clickhouse_connect.driver.client import Client

CLICKHOUSE_INTERNAL_PATH = (
    "/var/lib/clickhouse/user_files/parquet-data/extractors/clean"
)
RAW_DATA_PATH = "/parquet-data/extractors/raw"
CLEAN_DATA_PATH = "/parquet-data/extractors/clean"


def convert_case(name):
    snake_case = re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()
    return snake_case


def insert_data(network: str, protocol: str, contract_name: str, function_name: str):
    client: Client = clickhouse_connect.get_client(
        host="clickhouse", port=8123, user="default"
    )
    table_name = f"raw_{network}.{protocol}_{contract_name}_function_{function_name}"
    file_path = f"{CLICKHOUSE_INTERNAL_PATH}/{network}/{protocol}/{contract_name}_function_{function_name}/*.parquet"
    query = f"insert into {table_name} select * from file('{file_path}', 'Parquet')"
    client.command(query)
    client.close()


def insert_blocks(network: str, protocol: str):
    client: Client = clickhouse_connect.get_client(
        host="clickhouse", port=8123, user="default"
    )
    table_name = f"raw_{network}.{protocol}_block"
    file_path = f"{CLICKHOUSE_INTERNAL_PATH}/{network}/{protocol}/blocks.parquet"
    query = f"""
    insert into {table_name}
    select
        null as id,
        block_number as number,
        timestamp
    from file('{file_path}', 'Parquet')
    """
    client.command(query)
    client.close()
