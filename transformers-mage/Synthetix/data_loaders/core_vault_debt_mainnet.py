from mage_ai.settings.repo import get_repo_path
from mage_ai.io.config import ConfigFileLoader
from mage_ai.io.postgres import Postgres
from os import path
if 'data_loader' not in globals():
    from mage_ai.data_preparation.decorators import data_loader
if 'test' not in globals():
    from mage_ai.data_preparation.decorators import test


@data_loader
def load_data_from_postgres(data, *args, **kwargs):
    """
    get vault debt mainnet data
    """
    query = f"""
    -- with base as (
    --     select
    --         block_number,
    --         contract_address,
    --         chain_id,
    --         pool_id,
    --         collateral_type,
    --         cast(
    --             value_1 as numeric
    --         ) as debt
    --     from
    --         core_get_vault_debt
    --     where
    --         value_1 is not null
    -- )

    -- select
    --     to_timestamp(blocks.timestamp) as ts,
    --     cast(
    --         blocks.block_number as integer
    --     ) as block_number,
    --     base.contract_address,
    --     cast(
    --         base.pool_id as integer
    --     ) as pool_id,
    --     cast(
    --         base.collateral_type as varchar
    --     ) as collateral_type,
    --     base.dept/1e18 as debt
    -- from
    --     base
    -- inner join blocks_parquet as blocks
    --     on base.block_number = blocks.block_number
    -- where blocks.timestamp >= '{data["max_ts"][0]}'

    SELECT 
        * 
    FROM prod_raw_{kwargs['raw_db']}.core_vault_debt_{kwargs['raw_db']} 
    WHERE ts >= '{data["max_ts"][0]}'
    """
    config_path = path.join(get_repo_path(), 'io_config.yaml')
    config_profile = 'analytics'
    # config_profile = kwargs['raw_db']

    with Postgres.with_config(ConfigFileLoader(config_path, config_profile)) as loader:
        return loader.load(query)


@test
def test_output(output, *args) -> None:
    """
    Template code for testing the output of the block.
    """
    assert output is not None, 'The output is undefined'