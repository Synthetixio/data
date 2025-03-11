from os import path

if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test

from Synthetix.utils.clickhouse_utils import get_client

@data_loader
def load_data(data, *args, **kwargs):
    """
    get core vault collateral mainnet data
    """

    DATABASE = kwargs['raw_db']

    query = f"""
        WITH base AS (
            SELECT
                block_number,
                contract_address,
                chain_id,
                pool_id,
                collateral_type,
                amount,
                collateral_value
            FROM
                {DATABASE}.core_vault_collateral_parquet
            WHERE
                amount IS NOT NULL
        )

        SELECT
            blocks.timestamp AS ts,
            blocks.block_number as block_number,
            base.contract_address as contract_address,
            base.pool_id as pool_id,
            base.collateral_type AS collateral_type,
            base.amount AS amount,
            base.collateral_value AS collateral_value
        FROM
            base
        INNER JOIN {DATABASE}.blocks_parquet AS blocks
            ON base.block_number = blocks.block_number
        where ts >= '{data['max_ts'][0]}'
    """

    client = get_client()

    df = client.query_df(query)
    return df



@test
def test_output(output, *args) -> None:
    """
    Template code for testing the output of the block.
    """
    assert output is not None, 'The output is undefined'