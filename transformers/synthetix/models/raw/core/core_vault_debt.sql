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
    block_number,
    contract_address,
    call_data,
    output_data,
    chain_id,
    pool_id,
    collateral_type,
    {{ convert_wei('debt') }} AS debt
FROM
    base
