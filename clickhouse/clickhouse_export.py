import clickhouse_connect
from clickhouse_connect.driver.client import Client
import argparse
import time
import pathlib

OUTPUT_PATH = "/parquet-data/processed"


def get_tables(client: Client, network: str, schema: str):
    query = f"select name from system.tables where database = '{schema}'"
    return client.query(query).result_rows


def export_table(client: Client, network: str, schema: str, table: str):
    query = f"select * from {schema}.{table}"
    file_name = f"{OUTPUT_PATH}/{schema}/{table}.parquet"
    stream = client.raw_stream(query, fmt="Parquet")
    with open(file_name, "wb") as f:
        for chunk in stream:
            f.write(chunk)


def export_data(client: Client, network: str, schema: str):
    start_time = time.time()

    # Create the schema directory if it doesn't exist
    pathlib.Path(f"{OUTPUT_PATH}/{schema}").mkdir(parents=True, exist_ok=True)

    # Get the tables in the schema
    tables = get_tables(client, network, schema)

    # Export each table
    for table in tables:
        table_name = table[0]
        export_table(client, network, schema, table_name)

    end_time = time.time()
    print(f"Exported {len(tables)} tables in {end_time - start_time} seconds")


def main(network: str, target: str):
    client = clickhouse_connect.get_client(host="clickhouse", port=8123, user="default")

    raw_schema = f"{target}_raw_{network}"
    processed_schema = f"{target}_{network}"

    export_data(client, network, raw_schema)
    export_data(client, network, processed_schema)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--network", type=str, required=True)
    parser.add_argument("--target", type=str, required=True)
    args = parser.parse_args()
    main(args.network, args.target)
