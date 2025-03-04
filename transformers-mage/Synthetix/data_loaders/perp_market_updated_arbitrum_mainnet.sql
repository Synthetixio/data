WITH current_events AS (
    SELECT
        *
    FROM
        perps_market_proxy_event_market_updated
)

SELECT
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    contract,
    event_name,
    market_id,
    price,
    skew,
    size,
    size_delta,
    current_funding_rate,
    current_funding_velocity,
    interest_rate
FROM
    current_events