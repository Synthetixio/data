with spot_synth_registered as (
    {{ get_event_data('base', 'mainnet', 'synthetix', 'spot_market_proxy', 'synth_registered') }} -- noqa
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    cast(synth_market_id as UInt128) as synth_market_id,
    synth_token_address
from spot_synth_registered
