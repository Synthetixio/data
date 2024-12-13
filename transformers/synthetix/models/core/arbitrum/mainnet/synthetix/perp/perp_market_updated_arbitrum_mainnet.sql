with perps_market_updated as (
    {{ get_event_data('arbitrum', 'mainnet', 'synthetix', 'perps_market_proxy', 'market_updated') }} -- noqa
)

select
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    contract,
    event_name,
    cast(market_id as UInt128) as market_id,
    cast(price as UInt256) as price,
    cast(skew as Int256) as skew,
    cast(size as UInt256) as size,
    cast(size_delta as Int256) as size_delta,
    cast(current_funding_rate as Int256) as current_funding_rate,
    cast(current_funding_velocity as Int256) as current_funding_velocity,
    cast(interest_rate as UInt128) as interest_rate
from
    perps_market_updated
