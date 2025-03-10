if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.clickhouse_utils import get_client, table_exists

@data_loader
def load_data(*args, **kwargs):
    """
    Check wheather hourly pnl table exist

    Returns:
        Last Time stamp of pnl data
    """

    DATABASE = kwargs['analytics_db']
    TABLE_NAME = 'pnl_hourly'

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
            ts DateTime64(3),
            pool_id UInt8,
            collateral_type LowCardinality(String),
            collateral_value Float64,
            debt Float64,
            hourly_issuance Float64,
            hourly_pnl Float64,
            rewards_usd Float64,
            hourly_pnl_pct Float64,
            hourly_rewards_pct Float64,
            hourly_total_pct Float64
        )
        ENGINE = ReplacingMergeTree()
        ORDER BY (pool_id, collateral_type, ts)
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