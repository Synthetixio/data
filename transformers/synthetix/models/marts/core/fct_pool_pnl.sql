WITH debt AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        debt * -1 AS market_pnl
    FROM
        {{ ref('core_vault_debt') }}
)
SELECT
    ts,
    pool_id,
    collateral_type,
    market_pnl
FROM
    debt
ORDER BY
    ts
