if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'blocks_arbitrum_mainnet'
    DATABASE = 'arbitrum_mainnet'

    if 'block_number' in data.columns:
        data['block_number'] = data['block_number'].astype('uint64')
    
    # Define ClickHouse DDL
    ddl = f"""
        CREATE OR REPLACE TABLE {DATABASE}.{TABLE_NAME}
        (
            block_number UInt64,
        )
        ENGINE = MergeTree()
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