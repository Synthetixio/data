WITH market_updated AS (
    SELECT
        DISTINCT id,
        ts,
        market_id,
        net_issuance,
        reported_debt,
        token_amount,
        token_amount * CASE
            WHEN event_name = 'MarketUsdDeposited' THEN 1
            WHEN event_name = 'MarketUsdWithdrawn' THEN -1
            ELSE 0
        END AS token_amount_adjusted
    FROM
        {{ ref('fct_core_market_updated') }}
    WHERE
        market_id = 2
),
pnl AS (
    SELECT
        DISTINCT id,
        ts,
        market_id,
        LAST_VALUE((-1 * net_issuance) - (reported_debt + token_amount_adjusted)) over (
            PARTITION BY ts,
            market_id
            ORDER BY
                id
        ) AS market_pnl
    FROM
        market_updated
)
SELECT
    id,
    ts,
    market_id,
    market_pnl
FROM
    pnl
ORDER BY
    id
