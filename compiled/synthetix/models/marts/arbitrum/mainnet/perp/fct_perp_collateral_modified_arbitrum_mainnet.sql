select
    id,
    block_timestamp,
    account_id,
    block_number,
    transaction_hash,
    contract,
    event_name,
    collateral_id as synth_market_id,
    sender,
    
    amount_delta / 1e18
 as amount_delta
from
    "analytics"."prod_raw_arbitrum_mainnet"."perp_collateral_modified_arbitrum_mainnet"