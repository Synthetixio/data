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
            amount AS numeric
        ) AS amount,
        CAST(
            "value" AS numeric
        ) AS collateral_value
    FROM
        {{ source(
            'raw_' ~ target.name,
            "core_get_vault_collateral"
        ) }}
)
SELECT
    block_number,
    contract_address,
    call_data,
    output_data,
    chain_id,
    pool_id,
    collateral_type,
    {{ convert_wei('amount') }} AS amount,
    {{ convert_wei('collateral_value') }} AS collateral_value
FROM
    base
