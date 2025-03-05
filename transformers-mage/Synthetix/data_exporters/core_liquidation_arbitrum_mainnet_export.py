if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'core_liquidation_arbitrum_mainnet'
    DATABASE = 'prod_raw_arbitrum_mainnet'

    if 'account_id' in data.columns:
        data['account_id'] = data['account_id'].astype('uint64')
    if 'block_number' in data.columns:
        data['block_number'] = data['block_number'].astype('uint64')

    required_columns = [
        'pool_id', 'block_timestamp', 'block_number', 'id', 'contract', 'event_name',
        'collateral_type', 'sender', 'liquidation_data', 'account_id', 'transaction_hash',
        'liquidate_as_account_id'
    ]
    if not all(col in data.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {required_columns}")
    
    # Convert numeric columns to appropriate types
    data['pool_id'] = data['pool_id'].astype('uint64')  # UInt64
    data['block_number'] = data['block_number'].astype('uint64')  # UInt64
    data['account_id'] = data['account_id'].astype('uint64')  # UInt64
    data['liquidate_as_account_id'] = data['liquidate_as_account_id'].astype('uint64')

    if 'liquidation_data' in data.columns:
        data['liquidation_data'] = data['liquidation_data'].astype(str)
    
    # Define ClickHouse DDL
    ddl = f"""
        CREATE TABLE IF NOT EXISTS {DATABASE}.{TABLE_NAME}
        (
            pool_id UInt64,
            block_timestamp DateTime,
            block_number UInt64,
            id String,
            contract String,
            event_name String,
            collateral_type String,
            sender String,
            liquidation_data String,
            account_id UInt64,
            transaction_hash String,
            liquidate_as_account_id UInt64
        )
        ENGINE = ReplacingMergeTree()
        ORDER BY (block_number, pool_id, account_id);
    """
    client = get_client()

    client.query(ddl)
    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=data,
        column_names=data.columns.tolist()
    )
    
    print({'rows_inserted': len(data)})