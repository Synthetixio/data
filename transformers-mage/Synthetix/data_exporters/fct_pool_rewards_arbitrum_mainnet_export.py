if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client, ensure_database_exists
import pandas as pd

QUERY = """
INSERT INTO {DATABASE}.{TABLE_NAME}
SELECT
    rd.block_timestamp AS ts,
    rd.pool_id,
    rd.collateral_type,
    rd.distributor,
    d.token_symbol,
    rd.amount / 1e18 AS amount,
    toDateTime(rd.start) AS ts_start,
    rd.duration
FROM
    arbitrum_mainnet.core_rewards_distributed AS rd
INNER JOIN
    arbitrum_mainnet.reward_distributors AS d
ON
    rd.distributor = d.distributor_address
ORDER BY
    ts
"""

@data_exporter
def export_data(data, *args, **kwargs):
    """
    Export pool rewards data from the raw tables to ClickHouse.
    This exporter handles the conversion, validation, and loading process.
    """
    DATABASE = 'analytics'
    TABLE_NAME = 'fct_pool_rewards'

    ensure_database_exists(DATABASE)
    
    # Get ClickHouse client
    client = get_client()
    
    # Define ClickHouse DDL for the table
    ddl = f"""
        CREATE OR REPLACE TABLE {DATABASE}.{TABLE_NAME}
        (
            ts DateTime,
            pool_id UInt64,
            collateral_type String,
            distributor String,
            token_symbol String,
            amount Float64,
            ts_start DateTime,
            duration UInt64
        )
        ENGINE = MergeTree()
        ORDER BY (ts, pool_id, collateral_type, distributor)
        PRIMARY KEY (ts, pool_id, collateral_type, distributor)
    """
    
    # Create table in ClickHouse
    client.query(ddl)
    client.query(QUERY.format(DATABASE=DATABASE, TABLE_NAME=TABLE_NAME))
    
    # Return metadata about the operation
    return {
        'database': DATABASE,
        'table': TABLE_NAME,
    }