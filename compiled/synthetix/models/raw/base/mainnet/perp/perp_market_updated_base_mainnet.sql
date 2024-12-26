with legacy_events as (
    
SELECT
  *
FROM
  "analytics"."raw_base_mainnet"."perps_market_proxy_legacy_event_market_updated"

),

current_events as (
    
SELECT
  *
FROM
  "analytics"."raw_base_mainnet"."perps_market_proxy_event_market_updated"

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
    0 as interest_rate
from
    legacy_events
union all
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