import clickhouse_connect
from clickhouse_connect.driver.client import Client
import argparse
import os
import re

CLICKHOUSE_INTERNAL_PATH = "/var/lib/clickhouse/user_files/parquet-data"
BASE_PATH = "./parquet-data"


def convert_case(name):
    snake_case = re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()
    return snake_case


def get_event_list(root: str) -> set[str]:
    data_path = f"{BASE_PATH}/{root}"
    event_list = set()
    for root, dirs, files in os.walk(f"{data_path}"):
        for dir in dirs:
            event_name = dir
            event_list.add(event_name)
    print(f"Found {len(event_list)} events for {root}")
    return event_list


def create_table(
    client: Client,
    root: str,
    db_name: str,
    event: str,
):
    table_name = f"{db_name}.{convert_case(event)}"
    file_path = f"{CLICKHOUSE_INTERNAL_PATH}/{root}/{event}/*.parquet"
    query = (
        f"create table if not exists {table_name} "
        f"engine = MergeTree order by tuple() as "
        f"select * from file('{file_path}', 'Parquet')"
    )
    client.command(query)


def main(network: str, protocol: str):
    db_name = f"{network}_{protocol}"

    client = clickhouse_connect.get_client(host="localhost", port=8123, user="default")
    client.command(f"create database if not exists {db_name}")

    root = f"indexers/clean/{network}/{protocol}"

    # Get list of events to import
    event_list = get_event_list(root)

    # Create tables for each event
    for event in event_list:
        create_table(client, root, db_name, event)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--network_name", type=str)
    parser.add_argument("--protocol_name", type=str)
    args = parser.parse_args()

    network_name = os.getenv("NETWORK_NAME") or args.network_name
    protocol_name = os.getenv("PROTOCOL_NAME") or args.protocol_name

    if network_name in [None, ""] or protocol_name in [None, ""]:
        raise ValueError("Network and protocol must be provided")

    main(network_name, protocol_name)
