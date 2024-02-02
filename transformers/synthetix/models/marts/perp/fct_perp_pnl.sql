WITH market_updated AS (
    SELECT
        DISTINCT id,
        ts,
        market_id,
        LAST_VALUE((-1 * net_issuance) - (reported_debt + token_amount)) over (
            PARTITION BY ts,
            market_id
            ORDER BY
                id
        ) AS market_pnl
    FROM
        {{ ref('fct_core_market_updated') }}
    WHERE
        market_id = 2
)
SELECT
    id,
    ts,
    market_id,
    market_pnl
FROM
    market_updated
ORDER BY
    id
