SELECT
    ts,
    block_number,
    pool_id,
    collateral_type,
    debt
FROM
    "analytics"."prod_raw_arbitrum_sepolia"."core_vault_debt_arbitrum_sepolia"
ORDER BY
    ts