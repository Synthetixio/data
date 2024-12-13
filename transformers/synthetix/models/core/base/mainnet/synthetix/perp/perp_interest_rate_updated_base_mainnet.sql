with perps_interest_rate_updated as (
    {{ get_event_data('base', 'mainnet', 'synthetix', 'perps_market_proxy', 'interest_rate_updated') }} -- noqa
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    cast(super_market_id as UInt128) as super_market_id,
    cast(interest_rate as UInt128) as interest_rate
from perps_interest_rate_updated
