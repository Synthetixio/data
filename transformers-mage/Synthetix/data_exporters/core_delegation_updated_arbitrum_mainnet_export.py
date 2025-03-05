if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'core_delegation_updated_arbitrum_mainnet'
    DATABASE = 'prod_raw_arbitrum_mainnet'

    if 'account_id' in data.columns:
        data['account_id'] = data['account_id'].astype('uint64')
    if 'block_number' in data.columns:
        data['block_number'] = data['block_number'].astype('uint64')
    
    # Define ClickHouse DDL
    ddl = f"""
        CREATE TABLE IF NOT EXISTS {DATABASE}.{TABLE_NAME}
        (
            contract String,
            id String,
            account_id UInt64,
            collateral_type String,
            pool_id UInt64,
            sender String,
            block_timestamp DateTime,
            block_number UInt64,
            leverage Float64,
            transaction_hash String,
            amount Float64,
            event_name String
        )
        ENGINE = ReplacingMergeTree()
        ORDER BY (block_number, account_id, pool_id);
    """
    client = get_client()

    client.query(ddl)
    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=data,
        column_names=data.columns.tolist()
    )
    
    return {'rows_inserted': len(data)}
