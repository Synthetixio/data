if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'core_deposited_arbitrum_mainnet'
    DATABASE = 'prod_raw_arbitrum_mainnet'

    if 'account_id' in data.columns:
        data['account_id'] = data['account_id'].astype('uint64')
    if 'block_number' in data.columns:
        data['block_number'] = data['block_number'].astype('uint64')

     # Ensure required columns are present
    required_columns = ['collateral_type', 'id', 'contract', 'event_name', 'transaction_hash', 'account_id', 'sender', 'block_timestamp', 'block_number', 'token_amount']
    if not all(col in data.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {required_columns}")
    
    # Define ClickHouse DDL
    ddl = f"""
        CREATE TABLE IF NOT EXISTS {DATABASE}.{TABLE_NAME}
        (
            collateral_type String,
            id String,
            contract String,
            event_name String,
            transaction_hash String,
            account_id UInt64,
            sender String,
            block_timestamp DateTime,
            block_number UInt64,
            token_amount Float64
        )
        ENGINE = ReplacingMergeTree()
        ORDER BY (block_number, account_id)
        SETTINGS index_granularity = 8192;
    """
    client = get_client()

    client.query(ddl)
    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=data,
        column_names=data.columns.tolist()
    )
    
    print({'rows_inserted': len(data)})