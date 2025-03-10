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
    get core vault collateral mainnet data
    """
    query = f"""
-- WITH base AS (
--     SELECT
--         block_number,
--         contract_address,
--         chain_id,
--         '1' as pool_id,
--         collateral_type,
--         CAST(amount AS NUMERIC) AS amount,
--         CAST(value AS NUMERIC) AS collateral_value
--     FROM
--         core_get_vault_collateral
--     WHERE
--         amount IS NOT NULL
-- )

-- SELECT
--     TO_TIMESTAMP(blocks.timestamp) AS ts,
--     CAST(blocks.block_number AS INTEGER) AS block_number,
--     base.contract_address,
--     '1' AS pool_id,
--     CAST(base.collateral_type AS VARCHAR) AS collateral_type,
--     base.amount/1e18 AS amount,  -- Fixed typo in "amout"
--     base.collateral_value/1e18 AS collateral_value
-- FROM
--     base
-- INNER JOIN blocks_parquet AS blocks
--     ON base.block_number = blocks.block_number;
-- where blocks.timestamp >= '{data['max_ts'][0]}'

select 
    * 
from prod_raw_{kwargs["raw_db"]}.core_vault_collateral_{kwargs["raw_db"]}
where ts >= '{data["max_ts"][0]}'
"""
    config_path = path.join(get_repo_path(), 'io_config.yaml')
    config_profile = 'analytics'
    # config_profile = kwargs["raw_db"]

    with Postgres.with_config(ConfigFileLoader(config_path, config_profile)) as loader:
        return loader.load(query)


@test
def test_output(output, *args) -> None:
    """
    Template code for testing the output of the block.
    """
    assert output is not None, 'The output is undefined'