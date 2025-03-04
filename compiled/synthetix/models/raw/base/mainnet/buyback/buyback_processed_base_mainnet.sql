with legacy_events as (
    
SELECT
  *
FROM
  "analytics"."raw_base_mainnet"."buyback_snx_legacy_event_buyback_processed"

),

current_events as (
    
SELECT
  *
FROM
  "analytics"."raw_base_mainnet"."buyback_snx_event_buyback_processed"

)

select
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    event_name,
    contract,
    buyer,
    snx,
    usd
from
    legacy_events
union all
select
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    event_name,
    contract,
    buyer,
    snx,
    usd
from
    current_events