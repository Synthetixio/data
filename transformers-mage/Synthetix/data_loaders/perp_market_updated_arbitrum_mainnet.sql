WITH current_events AS (
    SELECT
        *
    FROM
        perps_market_proxy_event_market_updated
    where block_timestamp >= '{{ block_output("perp_market_updated_arbitrum_mainnet_check", parse=lambda data, _vars: data["max_ts"][0] if data["max_ts"][0] is not None else "1970-01-01 00:00:00") }}'
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