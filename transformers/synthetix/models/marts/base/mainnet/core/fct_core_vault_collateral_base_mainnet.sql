SELECT
    ts,
    block_number,
    contract_address,
    pool_id,
    collateral_type,
    amount,
    collateral_value
FROM
    {{ ref("core_vault_collateral_base_mainnet") }}
