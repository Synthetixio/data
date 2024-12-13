with spot_synth_wrapped as (
    {{ get_event_data('base', 'mainnet', 'synthetix', 'spot_market_proxy', 'synth_wrapped') }} -- noqa
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    cast(synth_market_id as UInt256) as synth_market_id,
    cast(amount_wrapped as UInt256) as amount_wrapped,
    fees,
    cast(fees_collected as UInt256) as fees_collected
from spot_synth_wrapped
