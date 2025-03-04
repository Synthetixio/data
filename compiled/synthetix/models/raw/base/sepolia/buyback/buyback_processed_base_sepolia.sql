with current_events as (
    
SELECT
  *
FROM
  "analytics"."raw_base_sepolia"."buyback_snx_event_buyback_processed"

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
    current_events