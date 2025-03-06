if 'transformer' not in globals():
    from mage_ai.data_preparation.decorators import transformer
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.clickhouse_utils import get_client, ensure_database_exists
import pandas as pd
import os

@transformer
def transform(data, *args, **kwargs):
    """
    Transform arbitrum mainnet core events and send it to clickhouse   
    """
    database = 'arbitrum_mainnet'
    table = 'core_events_base'
    
    ensure_database_exists(database)
    
    client = get_client()

    schema = """
    CREATE TABLE IF NOT EXISTS {database}.{table} (
        block_timestamp DateTime,
        block_number UInt64,
        transaction_hash String,
        account_id Nullable(UInt64),
        sender Nullable(String),
        collateral_type Nullable(String),
        token_amount Nullable(Float64),
        pool_id Nullable(UInt64),
        leverage Nullable(Float64),
        reward_start Nullable(UInt64),
        reward_duration Nullable(UInt64),
        market_id Nullable(UInt64),
        credit_capacity Nullable(Float64),
        net_issuance Nullable(Float64),
        distributor Nullable(String),
        contract Nullable(String),
        event_name String,
        id String
    ) ENGINE = ReplacingMergeTree()
    ORDER BY (block_timestamp, event_name, id)
    PRIMARY KEY (block_timestamp, event_name, id)
    """.format(database=database, table=table)

    client.query(schema)

    # Convert timestamps
    if 'block_timestamp' in data.columns and len(data) > 0:
        data['block_timestamp'] = pd.to_datetime(data['block_timestamp'])
    
    # Convert numeric columns
    numeric_cols = ['block_number', 'account_id', 'token_amount', 'pool_id',
                   'leverage', 'reward_start', 'reward_duration', 'market_id',
                   'credit_capacity', 'net_issuance']
    
    for col in numeric_cols:
        if col in data.columns:
            # First convert to float to handle NaNs
            data[col] = data[col].astype(float)
            # For integer columns, convert only non-NaN values
            if col in ['block_number', 'account_id', 'pool_id', 'market_id', 
                       'reward_start', 'reward_duration']:
                # Keep NaNs as is, convert only valid values to int
                data[col] = data[col].apply(lambda x: int(x) if not pd.isna(x) else None)

    # Insert data 
    client.insert_df(f"{database}.{table}", data)

    return data


@test
def test_output(output, *args) -> None:
    """
    Test the output of the block.
    """
    assert output is not None, 'The output is undefined'
    
    # Check for required columns
    required_columns = ['block_timestamp', 'block_number', 'event_name', 'id']
    for col in required_columns:
        assert col in output.columns, f'Missing required column: {col}'