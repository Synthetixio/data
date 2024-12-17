from clickhouse_connect.driver.client import Client


def create_table_from_path(client: Client, db_name: str, table_name: str, path: str):
    query = (
        f"create table if not exists {db_name}.{table_name} "
        f"engine = MergeTree order by tuple() as "
        f"select * from file('{path}', 'Parquet')"
    )
    try:
        client.command(query)
    except Exception as e:
        print(f"Error creating table {db_name}.{table_name}: {e}")


def insert_data_from_path(client: Client, db_name: str, table_name: str, path: str):
    query = (
        f"insert into {db_name}.{table_name} select * from file('{path}', 'Parquet')"
    )
    try:
        client.command(query)
    except Exception as e:
        print(f"Error inserting data into {db_name}.{table_name}: {e}")
