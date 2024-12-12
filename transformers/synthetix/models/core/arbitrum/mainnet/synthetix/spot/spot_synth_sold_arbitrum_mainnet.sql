with spot_synth_sold as (
    {{ get_event_data( -- noqa
        'arbitrum',
        'mainnet',
        'synthetix',
        'spot_market_proxy',
        'synth_sold'
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
    cast(amount_returned as UInt256) as amount_returned,
    fees,
    cast(collected_fees as UInt256) as collected_fees,
    referrer,
    cast(price as UInt256) as price
from spot_synth_sold
