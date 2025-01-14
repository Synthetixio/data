import argparse
import os
import time
from pathlib import Path
import clickhouse_connect

from utils.clickhouse_utils import (
    create_table_from_schema_file,
    insert_data_from_path,
)
from utils.utils import get_event_list_from_file_names

CLICKHOUSE_INTERNAL_PATH = "/var/lib/clickhouse/user_files/parquet-data/indexers/raw"
DATA_PATH = "/parquet-data/indexers/raw"
SCHEMAS_PATH = "/parquet-data/indexers/schemas"


def init_tables_from_schemas(client, network_name: str, protocol_name: str):
    print(f"Initializing tables for {network_name} {protocol_name}")
    schema_path = Path(f"{SCHEMAS_PATH}/{network_name}/{protocol_name}")
    db_name = f"raw_{network_name}"

    for schema_file in schema_path.glob("*.sql"):
        event_name = schema_file.stem
        table_name = f"{protocol_name}_{event_name}"

        table_exists = client.command(f"exists table {db_name}.{table_name}")

        if not table_exists:
            create_table_from_schema_file(client, str(schema_file))


def import_parquet_files(client, network_name: str, protocol_name: str):
    print(f"Inserting {network_name} {protocol_name} data into tables")
    raw_path = Path(f"{DATA_PATH}/{network_name}/{protocol_name}")
    db_name = f"raw_{network_name}"

    event_list = get_event_list_from_file_names(raw_path, network_name, raw_path)

    time_start = time.time()
    for event_name in event_list:
        table_name = f"{protocol_name}_{event_name}"
        file_path = f"{CLICKHOUSE_INTERNAL_PATH}/{network_name}/{protocol_name}/*/{event_name}.parquet"

        insert_data_from_path(client, db_name, table_name, file_path)
    time_end = time.time()
    print(f"Time taken: {time_end - time_start} seconds")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--network_name", type=str)
    parser.add_argument("--protocol_name", type=str)
    args = parser.parse_args()

    network_name = os.getenv("NETWORK_NAME") or args.network_name
    protocol_name = os.getenv("PROTOCOL_NAME") or args.protocol_name

    if network_name is None or protocol_name is None:
        raise ValueError("Network and protocol must be provided")

    client = clickhouse_connect.get_client(
        host="clickhouse",
        port=8123,
        username="default",
    )

    db_name = f"raw_{network_name}"
    client.command(f"CREATE DATABASE IF NOT EXISTS {db_name}")

    init_tables_from_schemas(client, network_name, protocol_name)
    import_parquet_files(client, network_name, protocol_name)
