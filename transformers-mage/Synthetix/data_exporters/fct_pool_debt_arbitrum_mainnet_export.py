if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client, ensure_database_exists
import pandas as pd

QUERY = """
INSERT INTO analytics.fct_pool_debt
SELECT
    ts,
    block_number,
    pool_id,
    collateral_type,
    debt
FROM
    arbitrum_mainnet.core_vault_debt
ORDER BY
    ts
"""

@data_exporter
def export_data(data, *args, **kwargs):
    """
    Export pool debt data from the raw tables to ClickHouse.
    This exporter handles the conversion, validation, and loading process.
    """
    DATABASE = 'analytics'
    TABLE_NAME = 'fct_pool_debt'

    ensure_database_exists(DATABASE)
    
    # Get ClickHouse client
    client = get_client()
    
    # Define ClickHouse DDL for the table
    ddl = f"""
        CREATE OR REPLACE TABLE {DATABASE}.{TABLE_NAME}
        (
            ts DateTime,
            block_number UInt64,
            pool_id UInt64,
            collateral_type String,
            debt Float64
        )
        ENGINE = MergeTree()
        ORDER BY (ts, pool_id, collateral_type)
        PRIMARY KEY (ts, pool_id, collateral_type)
    """
    
    # Create table in ClickHouse
    client.query(ddl)

    client.query(QUERY)
    
    # Return metadata about the operation
    return {
        'database': DATABASE,
        'table': TABLE_NAME,
    }