WITH events AS (
    SELECT
        *
    FROM
        {{ ref('v2_perp_margin_transferred') }}
)
SELECT
    id,
    transaction_hash,
    block_timestamp AS ts,
    block_number,
    market,
    account,
    {{ convert_wei('margin_delta') }} AS margin_delta,
    -- calculate cumulative net delta
    SUM({{ convert_wei('margin_delta') }}) over (
        PARTITION BY market
        ORDER BY
            id
    ) AS net_market_transfers,
    SUM({{ convert_wei('margin_delta') }}) over (
        ORDER BY
            id
    ) AS net_transfers
FROM
    events
