WITH legacy_events AS (
    
SELECT
  *
FROM
  "analytics"."raw_base_sepolia"."perps_market_proxy_legacy_event_order_committed"

),
current_events AS (
    
SELECT
  *
FROM
  "analytics"."raw_base_sepolia"."perps_market_proxy_event_order_committed"

)
SELECT
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    "contract",
    event_name,
    market_id,
    account_id,
    commitment_time,
    expiration_time,
    settlement_time,
    CAST(
        NULL AS numeric
    ) AS expected_price_time,
    acceptable_price,
    order_type,
    size_delta,
    sender,
    tracking_code
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
    account_id,
    commitment_time,
    expiration_time,
    settlement_time,
    expected_price_time,
    acceptable_price,
    order_type,
    size_delta,
    sender,
    tracking_code
FROM
    current_events