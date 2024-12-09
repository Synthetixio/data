with perps_interest_charged as (
    {{ get_event_data(
        'arbitrum',
        'mainnet',
        'synthetix',
        'perps_market_proxy',
        'interest_charged'
    ) }}
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    cast(account_id as UInt128) as account_id,
    cast(interest as UInt256) as interest
from perps_interest_charged