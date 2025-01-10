import re
from pathlib import Path
from clickhouse_connect.driver.client import Client


def get_event_list_from_file_names(root: str, network: str, data_path: str) -> set[str]:
    event_list = set()
    path = Path(data_path).rglob("*.parquet")
    for parquet_file in path:
        event_name = parquet_file.stem
        event_list.add(event_name)
    print(f"Found {len(event_list)} events for {network}")
    return event_list


def create_table_from_schema(client: Client, path: str):
    try:
        with open(path, "r") as file:
            query = file.read()
    except FileNotFoundError:
        print(f"Schema file {path} not found")
        return
    try:
        client.command(query)
    except Exception as e:
        print(f"Error creating table from schema {path}: {e}")


def insert_data_from_path(client: Client, db_name: str, table_name: str, path: str):
    columns_query = f"describe file('{path}', 'Parquet')"
    try:
        columns = client.query(columns_query).named_results()
        column_mappings = [
            f"{col['name']} as {convert_case(col['name'])}"
            for col in columns
        ]
        select_expr = ", ".join(column_mappings)
        query = (
            f"insert into {db_name}.{table_name} "
            f"select {select_expr} from file('{path}', 'Parquet')"
        )
        client.command(query)
    except Exception as e:
        print(f"Error inserting data into {db_name}.{table_name}: {e}")


def convert_case(name):
    snake_case = re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()
    return snake_case
