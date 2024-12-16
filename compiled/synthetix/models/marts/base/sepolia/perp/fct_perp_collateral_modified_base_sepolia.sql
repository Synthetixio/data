select
    cm.id,
    cm.block_timestamp,
    cm.account_id,
    cm.block_number,
    cm.transaction_hash,
    cm.contract,
    cm.event_name,
    synths.synth_symbol,
    cm.synth_market_id,
    synths.synth_token_address,
    cm.sender,
    
    cm.amount_delta / 1e18
 as amount_delta
from
    "analytics"."prod_raw_base_sepolia"."perp_collateral_modified_base_sepolia"
    as cm
inner join "analytics"."prod_seeds"."base_sepolia_synths" as synths
    on cm.synth_market_id = synths.synth_market_id