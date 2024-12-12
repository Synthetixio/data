with core_market_registered as (
    {{ get_event_data(
        'arbitrum',
        'mainnet',
        'synthetix',
        'core_proxy',
        'market_registered'
    ) }}
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    sender,
    market,
    cast(market_id as UInt128) as market_id
from core_market_registered
