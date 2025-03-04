with current_events as (
    
SELECT
  *
FROM
  "analytics"."raw_arbitrum_mainnet"."perps_market_proxy_event_order_committed"

)

select
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    contract,
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
from
    current_events