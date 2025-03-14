if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'core_market_updated'
    DATABASE = 'arbitrum_mainnet'

    if 'account_id' in data.columns:
        data['account_id'] = data['account_id'].astype('uint64')
    if 'block_number' in data.columns:
        data['block_number'] = data['block_number'].astype('uint64')

    required_columns = [
        'id', 'block_timestamp', 'block_number', 'transaction_hash', 'contract', 'event_name',
        'market_id', 'net_issuance', 'deposited_collateral_value', 'sender', 'collateral_type',
        'credit_capacity', 'token_amount'
    ]
    if not all(col in data.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {required_columns}")
    
    # Convert numeric columns to appropriate types
    data['block_number'] = data['block_number'].astype('uint64')  # UInt64
    data['market_id'] = data['market_id'].astype('uint64')  # UInt64
    data['net_issuance'] = data['net_issuance'].astype('float64')  # Float64
    data['deposited_collateral_value'] = data['deposited_collateral_value'].astype('float64')  # Float64
    data['credit_capacity'] = data['credit_capacity'].astype('float64')  # Float64
    data['token_amount'] = data['token_amount'].astype('float64')  # Float64
    
    # Define ClickHouse DDL
    ddl = f"""
        CREATE OR REPLACE TABLE {DATABASE}.{TABLE_NAME}
        (
            id String,
            block_timestamp DateTime,
            block_number UInt64,
            transaction_hash String,
            contract String,
            event_name String,
            market_id UInt64,
            net_issuance Float64,
            deposited_collateral_value Float64,
            sender String,
            collateral_type String,
            credit_capacity Float64,
            token_amount Float64
        )
        ENGINE = MergeTree()
        ORDER BY (block_number, market_id);
    """
    client = get_client()

    client.query(ddl)
    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=data,
        column_names=data.columns.tolist()
    )
    
    return {'rows_inserted': len(data)}
