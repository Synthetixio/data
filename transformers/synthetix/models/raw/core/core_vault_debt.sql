WITH base AS (
    SELECT
        block_number,
        contract_address,
        call_data,
        output_data,
        chain_id,
        pool_id,
        collateral_type,
        CAST(
            value_1 AS numeric
        ) AS debt
    FROM
        {{ source(
            'raw_' ~ target.name,
            "core_get_vault_debt"
        ) }}
    WHERE
        value_1 IS NOT NULL
)
SELECT
    blocks.ts,
    base.block_number,
    base.contract_address,
    base.call_data,
    base.output_data,
    CAST(
        base.chain_id AS INTEGER
    ) AS chain_id,
    CAST(
        base.pool_id AS INTEGER
    ) AS pool_id,
    CAST(
        base.collateral_type AS VARCHAR
    ) AS collateral_type,
    {{ convert_wei('base.debt') }} AS debt
FROM
    base
    JOIN {{ ref('block') }} AS blocks
    ON base.block_number = blocks.block_number
