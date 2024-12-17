import argparse
import os
from pathlib import Path
import clickhouse_connect
from .utils import create_table_from_path

CLICKHOUSE_INTERNAL_PATH = "/var/lib/clickhouse/user_files/parquet-data/indexers/clean"
CLEAN_DATA_PATH = "/parquet-data/indexers/clean"


def import_parquet_files(client, network_name: str, protocol_name: str):
    clean_path = Path(f"{CLEAN_DATA_PATH}/{network_name}/{protocol_name}")
    db_name = f"raw_{network_name}"

    for event_name in clean_path.iterdir():
        if not event_name.is_dir():
            continue
        event_name = event_name.name
        table_name = f"{protocol_name}_{event_name}"
        file_path = f"{CLICKHOUSE_INTERNAL_PATH}/{network_name}/{protocol_name}/{event_name}/*.parquet"

        client.command(f"drop table if exists {db_name}.{table_name}")
        create_table_from_path(client, db_name, table_name, file_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--network_name", type=str)
    parser.add_argument("--protocol_name", type=str)
    args = parser.parse_args()

    network_name = os.getenv("NETWORK_NAME") or args.network_name
    protocol_name = os.getenv("PROTOCOL_NAME") or args.protocol_name

    print(f"Cleaning {network_name} {protocol_name}")

    if network_name is None or protocol_name is None:
        raise ValueError("Network and protocol must be provided")

    client = clickhouse_connect.get_client(
        host="localhost", port=8123, username="default"
    )

    import_parquet_files(client, network_name, protocol_name)
