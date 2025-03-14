if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'core_withdrawn'
    DATABASE = 'arbitrum_mainnet'
    
    required_columns = [
        'block_timestamp', 'contract', 'block_number', 'transaction_hash', 
        'token_amount', 'collateral_type', 'account_id', 'id', 'sender', 'event_name'
    ]
    
    if not all(col in data.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {[col for col in required_columns if col not in data.columns]}")
    
    # Convert numeric columns to appropriate types
    data['block_number'] = data['block_number'].astype('uint64')  # UInt64
    data['account_id'] = data['account_id'].astype('uint64')  # UInt64
    data['token_amount'] = data['token_amount'].astype('float64')  # Float64
    
    # Define ClickHouse DDL
    ddl = f"""
        CREATE OR REPLACE TABLE {DATABASE}.{TABLE_NAME}
        (
            block_timestamp DateTime,
            contract String,
            block_number UInt64,
            transaction_hash String,
            token_amount Float64,
            collateral_type String,
            account_id UInt64,
            id String,
            sender String,
            event_name String
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