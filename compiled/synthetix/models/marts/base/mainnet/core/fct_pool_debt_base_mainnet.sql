SELECT
    ts,
    block_number,
    pool_id,
    collateral_type,
    debt
FROM
    "analytics"."prod_raw_base_mainnet"."core_vault_debt_base_mainnet"
ORDER BY
    ts