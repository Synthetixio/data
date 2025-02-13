select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    account_id,
    
    interest / 1e18
 as interest
from
    "analytics"."prod_raw_base_sepolia"."perp_interest_charged_base_sepolia"