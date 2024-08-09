
WITH debt AS (
    SELECT
        ts,
        2 AS market_id,
        debt * -1 AS market_pnl
    FROM
        "analytics"."prod_raw_base_mainnet"."core_vault_debt_base_mainnet"
)
SELECT
    ts,
    market_id,
    market_pnl
FROM
    debt
ORDER BY
    ts