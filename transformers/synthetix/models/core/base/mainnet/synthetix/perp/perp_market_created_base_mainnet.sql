with perps_market_created as (
    {{ get_event_data(
        'base',
        'mainnet',
        'synthetix',
        'perps_market_proxy',
        'market_created'
    ) }}
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    market_name,
    market_symbol,
    cast(perps_market_id as UInt128) as perps_market_id
from perps_market_created