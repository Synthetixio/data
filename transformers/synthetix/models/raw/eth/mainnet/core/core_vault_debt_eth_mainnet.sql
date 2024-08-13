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
            'raw_eth_mainnet',
            "core_get_vault_debt"
        ) }}
    WHERE
        value_1 IS NOT NULL
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
    {{ convert_wei('base.debt') }} AS debt
FROM
    base
    JOIN {{ ref('blocks_eth_mainnet') }} AS blocks
    ON base.block_number = blocks.block_number
