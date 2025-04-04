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
    source_dir, schema_name, file_name, table_name, db_params=DB_PARAMS
):
    # Connect to your PostgreSQL database
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()

    # Read the Parquet file schema using PyArrow
    parquet_file_path = f"/parquet-data/clean/{source_dir}/{file_name}.parquet"
    parquet_file = pq.ParquetFile(parquet_file_path)
    schema = parquet_file.schema.to_arrow_schema()

    # Generate the columns string for the CREATE FOREIGN TABLE command
    columns = ", ".join(
        [f'"{field.name}" {map_arrow_type_to_sql(field.type)}' for field in schema]
    )

    # SQL command to create the foreign table
    create_table_sql = f"""
    DROP FOREIGN TABLE IF EXISTS raw_{schema_name}.{table_name} CASCADE;
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


# eth mainnet
create_foreign_table_from_parquet(
    "eth_mainnet",
    "eth_mainnet",
    "blocks",
    "blocks_parquet",
)
create_foreign_table_from_parquet(
    "eth_mainnet",
    "eth_mainnet",
    "getVaultCollateral",
    "core_get_vault_collateral",
)
create_foreign_table_from_parquet(
    "eth_mainnet",
    "eth_mainnet",
    "getVaultDebt",
    "core_get_vault_debt",
)
create_foreign_table_from_parquet(
    "eth_mainnet",
    "eth_mainnet",
    "artificialDebt",
    "treasury_artificial_debt",
)

# base mainnet
create_foreign_table_from_parquet(
    "base_mainnet",
    "base_mainnet",
    "blocks",
    "blocks_parquet",
)
create_foreign_table_from_parquet(
    "base_mainnet",
    "base_mainnet",
    "getVaultCollateral",
    "core_get_vault_collateral",
)
create_foreign_table_from_parquet(
    "base_mainnet",
    "base_mainnet",
    "getVaultDebt",
    "core_get_vault_debt",
)
create_foreign_table_from_parquet(
    "base_mainnet",
    "base_mainnet_vaults",
    "totalAssets_eth_vault",
    "eth_vault_function_total_assets",
)
create_foreign_table_from_parquet(
    "base_mainnet",
    "base_mainnet_vaults",
    "totalAssets_btc_vault",
    "btc_vault_function_total_assets",
)
create_foreign_table_from_parquet(
    "base_mainnet",
    "base_mainnet_vaults",
    "exchangeRate_eth_vault",
    "eth_vault_function_exchange_rate",
)
create_foreign_table_from_parquet(
    "base_mainnet",
    "base_mainnet_vaults",
    "exchangeRate_btc_vault",
    "btc_vault_function_exchange_rate",
)

# base sepolia
create_foreign_table_from_parquet(
    "base_sepolia",
    "base_sepolia",
    "blocks",
    "blocks_parquet",
)
create_foreign_table_from_parquet(
    "base_sepolia",
    "base_sepolia",
    "getVaultCollateral",
    "core_get_vault_collateral",
)
create_foreign_table_from_parquet(
    "base_sepolia",
    "base_sepolia",
    "getVaultDebt",
    "core_get_vault_debt",
)

# arbitrum sepolia
create_foreign_table_from_parquet(
    "arbitrum_sepolia",
    "arbitrum_sepolia",
    "blocks",
    "blocks_parquet",
)
create_foreign_table_from_parquet(
    "arbitrum_sepolia",
    "arbitrum_sepolia",
    "getVaultCollateral",
    "core_get_vault_collateral",
)
create_foreign_table_from_parquet(
    "arbitrum_sepolia",
    "arbitrum_sepolia",
    "getVaultDebt",
    "core_get_vault_debt",
)

# arbitrum mainnet
create_foreign_table_from_parquet(
    "arbitrum_mainnet",
    "arbitrum_mainnet",
    "blocks",
    "blocks_parquet",
)
create_foreign_table_from_parquet(
    "arbitrum_mainnet",
    "arbitrum_mainnet",
    "getVaultCollateral",
    "core_get_vault_collateral",
)
create_foreign_table_from_parquet(
    "arbitrum_mainnet",
    "arbitrum_mainnet",
    "getVaultDebt",
    "core_get_vault_debt",
)

# optimism mainnet
create_foreign_table_from_parquet(
    "optimism_mainnet",
    "optimism_mainnet",
    "blocks",
    "blocks_parquet",
)
create_foreign_table_from_parquet(
    "optimism_mainnet",
    "optimism_mainnet",
    "getVaultCollateral",
    "core_get_vault_collateral",
)
create_foreign_table_from_parquet(
    "optimism_mainnet",
    "optimism_mainnet",
    "getVaultDebt",
    "core_get_vault_debt",
)