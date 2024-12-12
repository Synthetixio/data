with spot_synth_unwrapped as (
    {{ get_event_data(
        'base',
        'mainnet',
        'synthetix',
        'spot_market_proxy',
        'synth_unwrapped'
    ) }}
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    cast(synth_market_id as UInt128) as synth_market_id,
    cast(amount_unwrapped as UInt256) as amount_unwrapped,
    fees,
    cast(fees_collected as UInt256) as fees_collected
from spot_synth_unwrapped
