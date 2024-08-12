WITH base AS (
    SELECT
        block_number,
        contract_address,
        chain_id,
        pool_id,
        collateral_type,
        CAST(
            value_1 AS numeric
        ) AS debt
    FROM
        {{ source(
            'raw_arbitrum_mainnet',
            "core_get_vault_debt"
        ) }}
    WHERE
        value_1 IS NOT NULL
)
SELECT
    TO_TIMESTAMP(blocks."timestamp") AS ts,
    CAST(
        blocks."block_number" AS INTEGER
    ) AS block_number,
    base.contract_address,
    CAST(
        base.pool_id AS INTEGER
    ) AS pool_id,
    CAST(
        base.collateral_type AS VARCHAR
    ) AS collateral_type,
    {{ convert_wei('base.debt') }} AS debt
FROM
    base
    JOIN {{ source('raw_arbitrum_mainnet', 'blocks_parquet') }} AS blocks
    ON base.block_number = blocks.block_number
