with perps_position_liquidated as (
    {{ get_event_data( -- noqa
        'arbitrum',
        'mainnet',
        'synthetix',
        'perps_market_proxy',
        'position_liquidated'
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
    cast(market_id as UInt128) as market_id,
    cast(amount_liquidated as UInt256) as amount_liquidated,
    cast(current_position_size as Int128) as current_position_size
from perps_position_liquidated
