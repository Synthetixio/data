if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.clickhouse_utils import get_client, table_exists

@data_loader
def load_data(data, *args, **kwargs):
    """
    status check of perp market created raw table
    """

    if kwargs['raw_db'] in ['eth_mainnet']:
        return {}

    
    DATABASE = data['raw']
    TABLE_NAME = 'perp_market_created'

    TABLE_EXISTS = True
    EMPTY_TABLE = False

    # check if table exists
    TABLE_EXISTS = table_exists(f'{DATABASE}.{TABLE_NAME}')

    client = get_client()
    # create table if not
    if not TABLE_EXISTS:
        client.query(f"""
        CREATE TABLE IF NOT EXISTS  {DATABASE}.{TABLE_NAME}
        (
            id String,
            block_timestamp DateTime64(3, 'UTC'),
            block_number Int64,
            transaction_hash String,
            contract String,
            event_name String,
            perps_market_id Float64,
            market_name LowCardinality(String),
            market_symbol LowCardinality(String)
        )
        ENGINE = MergeTree()
        ORDER BY (perps_market_id, market_name, market_symbol)
        PARTITION BY toYYYYMM(block_timestamp)
        """
        )

    # if exits
    result_df = client.query_df(f'select max(block_timestamp) as max_ts from {DATABASE}.{TABLE_NAME}')

    return result_df


@test
def test_output(output, *args) -> None:
    """
    Template code for testing the output of the block.
    """
    assert output is not None, 'The output is undefined'