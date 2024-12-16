with current_events as (
    
SELECT
  *
FROM
  "analytics"."raw_arbitrum_sepolia"."perps_market_proxy_event_market_updated"

)

select
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
from
    current_events