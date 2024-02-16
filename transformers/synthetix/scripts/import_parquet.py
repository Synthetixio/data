import pandas as pd
import psycopg2
import pyarrow.parquet as pq
import os

# configurations
DB_PARAMS = {
    "dbname": "analytics",
    "user": "postgres",
    "password": os.getenv("PG_PASSWORD"),
    "host": "db",
    "port": "5432",
}


def create_foreign_table_from_parquet(
    schema_name, file_name, table_name, db_params=DB_PARAMS
):
    # Connect to your PostgreSQL database
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()

    # Read the Parquet file schema using PyArrow
    parquet_file_path = f"/parquet-data/clean/{schema_name}/{file_name}.parquet"
    parquet_file = pq.ParquetFile(parquet_file_path)
    schema = parquet_file.schema.to_arrow_schema()

    # Generate the columns string for the CREATE FOREIGN TABLE command
    columns = ", ".join(
        [f'"{field.name}" {map_arrow_type_to_sql(field.type)}' for field in schema]
    )

    # SQL command to create the foreign table
    create_table_sql = f"""
    DROP FOREIGN TABLE IF EXISTS raw_{schema_name}.{table_name};
    CREATE FOREIGN TABLE raw_{schema_name}.{table_name} (
        {columns}
    ) SERVER parquet_server
    OPTIONS (filename '{parquet_file_path}');
    """

    # Execute the command
    cursor.execute(create_table_sql)
    conn.commit()

    # Close the connection
    cursor.close()
    conn.close()

    print(f"Foreign table raw_{schema_name}.{table_name} created successfully.")


def map_arrow_type_to_sql(arrow_type):
    """Function to map PyArrow types to PostgreSQL types"""
    mapping = {
        "int64": "bigint",
        "float64": "double precision",
        "string": "text",
        "bool": "boolean",
        "timestamp[ms]": "timestamp",
    }
    arrow_type_str = str(arrow_type)
    return mapping.get(arrow_type_str, "text")


# Run the function
table_name = "get_vault_collateral"

# get vault collateral
create_foreign_table_from_parquet(
    "base_mainnet", "getVaultCollateral", "core_get_vault_collateral"
)
create_foreign_table_from_parquet(
    "base_sepolia", "getVaultCollateral", "core_get_vault_collateral"
)
