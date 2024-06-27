WITH base AS (
    SELECT
        block_number,
        contract_address,
        chain_id,
        pool_id,
        collateral_type,
        CAST(
            amount AS numeric
        ) AS amount,
        CAST(
            "value" AS numeric
        ) AS collateral_value
    FROM
        {{ source(
            'raw_base_sepolia',
            "core_get_vault_collateral"
        ) }}
    WHERE
        amount IS NOT NULL
)
SELECT
    blocks.ts,
    base.block_number,
    base.contract_address,
    CAST(
        base.pool_id AS INTEGER
    ) AS pool_id,
    CAST(
        base.collateral_type AS VARCHAR
    ) AS collateral_type,
    {{ convert_wei('base.amount') }} AS amount,
    {{ convert_wei('base.collateral_value') }} AS collateral_value
FROM
    base
    JOIN {{ ref('blocks_base_sepolia') }} AS blocks
    ON base.block_number = blocks.block_number
