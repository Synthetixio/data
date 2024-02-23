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
    base.chain_id,
    base.pool_id,
    base.collateral_type,
    {{ convert_wei('base.debt') }} AS debt
FROM
    base
    JOIN {{ ref('block') }} AS blocks
    ON base.block_number = blocks.block_number
