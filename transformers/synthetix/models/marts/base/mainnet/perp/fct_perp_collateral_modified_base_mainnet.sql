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
    {{ convert_wei("cm.amount_delta") }} as amount_delta
from
    {{ ref("perp_collateral_modified_base_mainnet") }}
    as cm
inner join {{ ref('base_mainnet_synths') }} as synths
    on cm.synth_market_id = synths.synth_market_id
