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
    with base as (
        select
            block_number,
            contract_address,
            chain_id,
            pool_id,
            collateral_type,
            debt
        from
            {DATABASE}.core_vault_debt_parquet
        where
            debt is not null
    )

    select
        blocks.timestamp as ts,
        blocks.block_number as block_number,
        base.contract_address as contract_address,
        base.pool_id as pool_id,
        base.collateral_type as collateral_type,
        base.debt as debt
    from
        base
    inner join {DATABASE}.blocks_parquet as blocks
        on base.block_number = blocks.block_number
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