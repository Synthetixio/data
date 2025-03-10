if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

from Synthetix.utils.clickhouse_utils import get_client, ensure_database_exists
import pandas as pd

QUERY = """
INSERT INTO {DATABASE}.{TABLE_NAME}
WITH events AS (
    SELECT
        block_timestamp AS ts,
        token_amount / 1e18 AS token_amount,
        collateral_type
    FROM
        arbitrum_mainnet.core_deposited
    UNION ALL
    SELECT
        block_timestamp AS ts,
        -token_amount / 1e18 AS token_amount,
        collateral_type
    FROM
        arbitrum_mainnet.core_withdrawn
),
ranked_events AS (
    SELECT
        ts,
        collateral_type,
        SUM(token_amount) OVER (
            PARTITION BY collateral_type
            ORDER BY ts
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS amount_deposited
    FROM
        events
)
SELECT
    ts,
    collateral_type,
    amount_deposited
FROM
    ranked_events
ORDER BY
    ts,
    collateral_type
"""

@data_exporter
def export_data(data, *args, **kwargs):
    """
    Export pool collateral data from the raw tables to ClickHouse.
    This exporter handles the conversion, validation, and loading process.
    """
    DATABASE = 'analytics'
    TABLE_NAME = 'fct_core_pool_collateral'

    ensure_database_exists(DATABASE)
    
    # Get ClickHouse client
    client = get_client()
    
    # Define ClickHouse DDL for the table
    ddl = f"""
        CREATE OR REPLACE TABLE {DATABASE}.{TABLE_NAME}
        (
            ts DateTime,
            collateral_type String,
            amount_deposited Float64
        )
        ENGINE = MergeTree()
        ORDER BY (ts, collateral_type)
        PRIMARY KEY (ts, collateral_type)
    """
    
    client.query(ddl)
    
    client.query(QUERY.format(DATABASE=DATABASE, TABLE_NAME=TABLE_NAME))
    
    return {
        'database': DATABASE,
        'table': TABLE_NAME,
    }