with spot_synth_bought as (
    {{ get_event_data('arbitrum', 'mainnet', 'synthetix', 'spot_market_proxy', 'synth_bought') }} -- noqa
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    cast(synth_market_id as UInt128) as synth_market_id,
    cast(synth_returned as UInt256) as synth_returned,
    fees,
    cast(collected_fees as UInt256) as collected_fees,
    referrer,
    cast(price as UInt256) as price
from spot_synth_bought
