import clickhouse_connect
from clickhouse_connect.driver.client import Client
import argparse
import os
import re

BASE_PATH = "/var/lib/clickhouse/user_files/parquet-data"


def convert_case(name):
    snake_case = re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()
    return snake_case


def get_event_list(path: str, network: str) -> set[str]:
    event_list = set()
    for root, dirs, files in os.walk(f"{path}"):
        for file in files:
            if file.endswith(".parquet"):
                event_name = file.split(".")[0]
                event_list.add(event_name)
    print(f"Found {len(event_list)} events for {network}")
    return event_list


def create_table(
    client: Client,
    event_name: str,
    network: str,
    path: str,
    hive_partition: bool = False,
):
    table_name = f"{network}.{convert_case(event_name)}"
    if hive_partition:
        file_path = f"{path}/*/{event_name}.parquet"
    else:
        file_path = f"{path}/{event_name}.parquet"
    query = (
        f"create table if not exists {table_name} "
        f"engine = MergeTree order by tuple() as "
        f"select * from file('{file_path}', 'Parquet')"
    )
    client.command(query)


def import_data(client: Client, network: str, path: str, hive_partition: bool = False):
    event_list = get_event_list(path, network)
    for event_name in event_list:
        create_table(client, event_name, network, path, hive_partition)


def main(network: str):
    client = clickhouse_connect.get_client(host="clickhouse", port=8123, user="default")
    client.command(f"create database if not exists {network}")

    path_indexed_data = f"{BASE_PATH}/indexed/{network}"
    path_extracted_data = f"{BASE_PATH}/clean/{network}"

    import_data(client, network, path_indexed_data, hive_partition=True)
    import_data(client, network, path_extracted_data)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--network", type=str, required=True)
    args = parser.parse_args()
    main(args.network)
