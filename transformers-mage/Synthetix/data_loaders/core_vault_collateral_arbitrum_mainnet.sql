-- this one needs foriegn tables

WITH base AS (
    SELECT
        block_number,
        contract_address,
        chain_id,
        pool_id,
        collateral_type,
        CAST(amount AS NUMERIC) AS amount,
        CAST(value AS NUMERIC) AS collateral_value
    FROM
        core_get_vault_collateral
    WHERE
        amount IS NOT NULL
)

SELECT
    TO_TIMESTAMP(blocks.timestamp) AS ts,
    CAST(blocks.block_number AS INTEGER) AS block_number,
    base.contract_address,
    CAST(base.pool_id AS INTEGER) AS pool_id,
    CAST(base.collateral_type AS VARCHAR) AS collateral_type,
    base.amount/1e18 AS amount,  -- Fixed typo in "amout"
    base.collateral_value/1e18 AS collateral_value
FROM
    base
INNER JOIN {{ df_2 }} AS blocks
    ON base.block_number = blocks.block_number;