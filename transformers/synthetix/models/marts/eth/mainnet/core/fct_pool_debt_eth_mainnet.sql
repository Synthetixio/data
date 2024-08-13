SELECT
    ts,
    block_number,
    pool_id,
    collateral_type,
    debt
FROM
    {{ ref('core_vault_debt_eth_mainnet') }}
ORDER BY
    ts
