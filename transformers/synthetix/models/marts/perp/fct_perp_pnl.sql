WITH debt AS (
    SELECT
        ts,
        2 AS market_id,
        debt * -1 AS market_pnl
    FROM
        {{ ref('core_vault_debt') }}
)
SELECT
    ts,
    market_id,
    market_pnl
FROM
    debt
ORDER BY
    ts
