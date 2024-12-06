select
    cm.id,
    cm.block_timestamp,
    cm.account_id,
    cm.block_number,
    cm.transaction_hash,
    cm.contract,
    cm.event_name,
    synths.synth_symbol,
    cm.collateral_id as synth_market_id,
    synths.synth_token_address,
    cm.sender,
    
    cm.amount_delta / 1e18
 as amount_delta
from
    "analytics"."prod_raw_arbitrum_mainnet"."perp_collateral_modified_arbitrum_mainnet"
    as cm
inner join "analytics"."prod_seeds"."arbitrum_mainnet_synths" as synths
    on cm.collateral_id = synths.synth_market_id