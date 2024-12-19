import re
from clickhouse_connect.driver.client import Client


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
    query = (
        f"insert into {db_name}.{table_name} select * from file('{path}', 'Parquet')"
    )
    try:
        client.command(query)
    except Exception as e:
        print(f"Error inserting data into {db_name}.{table_name}: {e}")


def convert_case(name):
    snake_case = re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()
    return snake_case
