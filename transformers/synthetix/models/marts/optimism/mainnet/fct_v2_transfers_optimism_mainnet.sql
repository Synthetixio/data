WITH events AS (
    SELECT
        *
    FROM
        {{ ref('v2_perp_margin_transferred_optimism_mainnet') }}
)
SELECT
    id,
    transaction_hash,
    block_timestamp AS ts,
    block_number,
    market,
    account,
    margin_delta,
    -- calculate cumulative net delta
    SUM(margin_delta) over (
        PARTITION BY market
        ORDER BY
            id
    ) AS net_market_transfers,
    SUM(margin_delta) over (
        ORDER BY
            id
    ) AS net_transfers
FROM
    events
