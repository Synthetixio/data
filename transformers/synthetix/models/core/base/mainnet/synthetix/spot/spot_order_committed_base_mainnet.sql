with spot_order_committed as (
    {{ get_event_data('base', 'mainnet', 'synthetix', 'spot_market_proxy', 'order_committed') }} -- noqa
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    cast(market_id as UInt128) as market_id,
    cast(order_type as UInt8) as order_type,
    cast(amount_provided as UInt256) as amount_provided,
    cast(async_order_id as UInt128) as async_order_id,
    sender,
    referrer
from spot_order_committed
