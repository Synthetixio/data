with spot_order_settled as (
    {{ get_event_data( -- noqa
        'arbitrum',
        'mainnet',
        'synthetix',
        'spot_market_proxy',
        'order_settled'
    ) }}
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    cast(market_id as UInt128) as market_id,
    cast(async_order_id as UInt128) as async_order_id,
    cast(final_order_amount as UInt256) as final_order_amount,
    fees,
    cast(collected_fees as UInt256) as collected_fees,
    settler,
    cast(price as UInt256) as price,
    cast(order_type as UInt8) as order_type
from spot_order_settled
