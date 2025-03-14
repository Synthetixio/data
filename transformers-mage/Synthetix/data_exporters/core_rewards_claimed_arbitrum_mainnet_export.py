if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'core_proxy_event_rewards_claimed'
    DATABASE = 'arbitrum_mainnet'
    
    required_columns = [
        'transaction_hash', 'account_id', 'collateral_type', 'event_name', 'contract',
        'amount', 'distributor', 'block_timestamp', 'id', 'pool_id', 'block_number'
    ]
    
    if not all(col in data.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {[col for col in required_columns if col not in data.columns]}")
    
    # Convert numeric columns to appropriate types
    data['block_number'] = data['block_number'].astype('uint64')  # UInt64
    data['pool_id'] = data['pool_id'].astype('uint64')  # UInt64
    data['account_id'] = data['account_id'].astype('uint64')  # UInt64
    data['amount'] = data['amount'].astype('float64')  # Float64
    
    # Define ClickHouse DDL
    ddl = f"""
        CREATE OR REPLACE TABLE {DATABASE}.{TABLE_NAME}
        (
            transaction_hash String,
            account_id UInt64,
            collateral_type String,
            event_name String,
            contract String,
            amount Float64,
            distributor String,
            block_timestamp DateTime,
            id String,
            pool_id UInt64,
            block_number UInt64
        )
        ENGINE = MergeTree()
        ORDER BY (block_number, id);
    """
    
    client = get_client()
    
    client.query(ddl)
    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=data,
        column_names=data.columns.tolist()
    )
    
    return {'rows_inserted': len(data)}