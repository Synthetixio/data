if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.clickhouse_utils import get_client, table_exists

@data_loader
def load_data(data, *args, **kwargs):
    """
    status check of core usd burned raw table
    """
    DATABASE = data['raw']
    TABLE_NAME = 'core_usd_burned'

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
            amount Float64,
            pool_id UInt64,
            event_name String,
            id String,
            block_number UInt64,
            account_id UInt64,
            sender String,
            transaction_hash String,
            contract String,
            collateral_type String,
            block_timestamp DateTime
        )
        ENGINE = MergeTree()
        ORDER BY (collateral_type, account_id)
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