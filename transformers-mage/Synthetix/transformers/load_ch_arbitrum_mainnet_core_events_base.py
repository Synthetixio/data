if 'transformer' not in globals():
    from mage_ai.data_preparation.decorators import transformer
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.clickhouse_utils import get_client, ensure_database_exists
import pandas as pd
import numpy as np

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
    CREATE OR REPLACE TABLE {database}.{table} (
        block_timestamp DateTime64(3),
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
    ) ENGINE = MergeTree()
    ORDER BY (block_timestamp, event_name, id)
    PRIMARY KEY (block_timestamp, event_name, id)
    """.format(database=database, table=table)

    client.query(schema)

    # Make a copy to avoid modifying original data
    df = data.copy()
    
    # Convert timestamps
    if 'block_timestamp' in df.columns and len(df) > 0:
        df['block_timestamp'] = pd.to_datetime(df['block_timestamp'])
    
    # Safe conversion function that handles large integers
    def safe_convert(val, target_type):
        if pd.isna(val):
            return None
        try:
            if target_type == 'int':
                # Use numpy int64 which can handle larger values
                return np.int64(val)
            elif target_type == 'float':
                return float(val)
            else:
                return val
        except (ValueError, OverflowError, TypeError):
            # If conversion fails, log and return None
            print(f"Warning: Could not convert value {val} to {target_type}")
            return None
    
    # Handle string columns
    string_cols = ['transaction_hash', 'sender', 'collateral_type', 'distributor', 'contract', 'event_name', 'id']
    for col in string_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).replace('None', None).replace('nan', None)
    
    # Handle numeric columns with safe conversion
    float_cols = ['token_amount', 'leverage', 'credit_capacity', 'net_issuance']
    for col in float_cols:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: safe_convert(x, 'float'))
    
    int_cols = ['block_number', 'account_id', 'pool_id', 'reward_start', 'reward_duration', 'market_id']
    for col in int_cols:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: safe_convert(x, 'int'))
    
    # Drop any rows where all required columns are null (to avoid insertion errors)
    required_cols = ['block_timestamp', 'block_number', 'event_name', 'id']
    df = df.dropna(subset=required_cols, how='all')
    
    # Convert any remaining NaN values to None for ClickHouse
    df = df.replace({np.nan: None})
    
    # Insert data in batches to handle potential size issues
    batch_size = 10000
    total_rows = len(df)
    
    for i in range(0, total_rows, batch_size):
        end_idx = min(i + batch_size, total_rows)
        batch_df = df.iloc[i:end_idx].copy()
        
        try:
            client.insert_df(f"{database}.{table}", batch_df)
            print(f"Inserted batch {i//batch_size + 1} ({i} to {end_idx} of {total_rows} rows)")
        except Exception as e:
            print(f"Error inserting batch {i//batch_size + 1}: {str(e)}")
            # If you want to debug the problematic records:
            # print(f"Problem batch data types: {batch_df.dtypes}")
            # print(f"Sample of problem batch: {batch_df.head(2)}")
            raise e

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