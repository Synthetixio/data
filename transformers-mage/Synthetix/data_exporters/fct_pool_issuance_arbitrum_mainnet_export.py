if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client, ensure_database_exists
import pandas as pd

QUERY = """
INSERT INTO {DATABASE}.{TABLE_NAME}
SELECT
    block_timestamp AS ts,
    block_number,
    transaction_hash,
    pool_id,
    collateral_type,
    account_id,
    - (amount / 1e18) AS amount
FROM
    arbitrum_mainnet.core_usd_burned
UNION ALL
SELECT
    block_timestamp AS ts,
    block_number,
    transaction_hash,
    pool_id,
    collateral_type,
    account_id,
    amount / 1e18 AS amount
FROM
    arbitrum_mainnet.core_usd_minted
ORDER BY
    ts DESC
"""

@data_exporter
def export_data(data, *args, **kwargs):
    """
    Export pool issuance data from the raw tables to ClickHouse.
    This exporter handles the conversion, validation, and loading process.
    """
    DATABASE = 'analytics'
    TABLE_NAME = 'fct_pool_issuance'

    ensure_database_exists(DATABASE)
    
    # Get ClickHouse client
    client = get_client()
    
    # Define ClickHouse DDL for the table
    ddl = f"""
        CREATE OR REPLACE TABLE {DATABASE}.{TABLE_NAME}
        (
            ts DateTime,
            block_number UInt64,
            transaction_hash String,
            pool_id UInt64,
            collateral_type String,
            account_id String,
            amount Float64
        )
        ENGINE = MergeTree()
        ORDER BY (ts, transaction_hash)
        PRIMARY KEY (ts, transaction_hash)
    """
    
    # Create table in ClickHouse
    client.query(ddl)

    client.query(QUERY.format(DATABASE=DATABASE, TABLE_NAME=TABLE_NAME))
    
    # Return metadata about the operation
    return {
        'database': DATABASE,
        'table': TABLE_NAME,
    }