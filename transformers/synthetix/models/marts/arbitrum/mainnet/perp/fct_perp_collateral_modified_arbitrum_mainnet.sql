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
    {{ convert_wei("cm.amount_delta") }} as amount_delta
from
    {{ ref("perp_collateral_modified_arbitrum_mainnet") }}
    as cm
inner join {{ ref('arbitrum_mainnet_synths') }} as synths
    on cm.collateral_id = synths.synth_market_id
