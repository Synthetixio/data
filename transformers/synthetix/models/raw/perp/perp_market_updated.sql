WITH legacy_events AS (
    {{ get_event_data(
        'perps_market_proxy_legacy',
        'market_updated'
    ) }}
),
current_events AS (
    {{ get_event_data(
        'perps_market_proxy',
        'market_updated'
    ) }}
)
SELECT
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    "contract",
    event_name,
    market_id,
    price,
    skew,
    SIZE,
    size_delta,
    current_funding_rate,
    current_funding_velocity,
    0 AS interest_rate
FROM
    legacy_events
UNION ALL
SELECT
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    "contract",
    event_name,
    market_id,
    price,
    skew,
    SIZE,
    size_delta,
    current_funding_rate,
    current_funding_velocity,
    interest_rate
FROM
    current_events
