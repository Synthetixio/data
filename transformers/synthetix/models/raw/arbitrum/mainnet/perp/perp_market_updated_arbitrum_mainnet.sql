with current_events as (
    {{ get_event_data(
        'arbitrum',
        'mainnet',
        'perps_market_proxy',
        'market_updated'
    ) }}
)

select
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    contract,
    event_name,
    market_id,
    price,
    skew,
    size,
    size_delta,
    current_funding_rate,
    current_funding_velocity,
    interest_rate
from
    current_events
