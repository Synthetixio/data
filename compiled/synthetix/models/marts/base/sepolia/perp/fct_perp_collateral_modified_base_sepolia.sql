select
    id,
    block_timestamp,
    account_id,
    block_number,
    transaction_hash,
    contract,
    event_name,
    synth_market_id,
    sender,
    
    amount_delta / 1e18
 as amount_delta
from
    "analytics"."prod_raw_base_sepolia"."perp_collateral_modified_base_sepolia"