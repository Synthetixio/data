-- SQL for core_vault_debt_eth_mainnet

WITH base AS (
    SELECT
        block_number,
        contract_address,
        chain_id,
        pool_id,
        collateral_type,
        CAST(value_1 AS numeric) AS debt
    FROM
        analytics.raw_eth_mainnet.core_get_vault_debt
    WHERE
        value_1 IS NOT NULL
)

SELECT
    TO_TIMESTAMP(blocks.timestamp) AS ts,
    base.block_number,
    base.contract_address,
    CAST(base.pool_id AS integer) AS pool_id,
    CAST(base.collateral_type AS varchar) AS collateral_type,
    base.debt / 1e18 AS debt  -- This is using the convert_wei macro
FROM base
INNER JOIN analytics.raw_eth_mainnet.blocks_parquet AS blocks
    ON base.block_number = blocks.block_number