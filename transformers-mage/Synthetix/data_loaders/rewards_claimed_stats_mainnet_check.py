if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.clickhouse_utils import get_client, table_exists

@data_loader
def load_data(*args, **kwargs):
    """
    Check wheather hourly market prices exist

    Returns:
        Pull Issuance exists
    """

    if kwargs['raw_db'] in ['eth_mainnet']:
        return {}

    DATABASE = kwargs['analytics_db']
    TABLE_NAME = 'rewards_claimed'

    TABLE_EXISTS = True
    EMPTY_TABLE = False

    # check if table exists
    TABLE_EXISTS = table_exists(f'{DATABASE}.{TABLE_NAME}')

    client = get_client()
    # create table if not
    if not TABLE_EXISTS:
        client.query(f"""
        CREATE TABLE IF NOT EXISTS {DATABASE}.{TABLE_NAME}
        (
            ts DateTime,
            pool_id UInt8,
            collateral_type LowCardinality(String),
            account_id UInt64,
            reward_type LowCardinality(String),
            distributor LowCardinality(String),
            token_symbol LowCardinality(String),
            amount Float64,
            price Float64,
            amount_usd Float64,
        )
        ENGINE = ReplacingMergeTree()
        ORDER BY (account_id, pool_id, collateral_type, token_symbol)
        PARTITION BY toYYYYMM(ts)
        """
        )

    # if exits
    result_df = client.query_df(f'select max(ts) as max_ts from {DATABASE}.{TABLE_NAME}')

    return result_df


@test
def test_output(output, *args) -> None:
    """
    Template code for testing the output of the block.
    """
    assert output is not None, 'The output is undefined'