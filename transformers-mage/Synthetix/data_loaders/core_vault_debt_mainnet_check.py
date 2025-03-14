if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.clickhouse_utils import get_client, table_exists

@data_loader
def load_data(data, *args, **kwargs):
    """
    status check of core vault raw table
    """
    DATABASE = data['raw']
    TABLE_NAME = 'core_vault_debt'

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
            ts DateTime64(3),
            block_number UInt64,
            contract_address String,
            pool_id UInt32,
            collateral_type String,
            debt Float64
        )
        ENGINE = MergeTree()
        ORDER BY (collateral_type, contract_address)
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