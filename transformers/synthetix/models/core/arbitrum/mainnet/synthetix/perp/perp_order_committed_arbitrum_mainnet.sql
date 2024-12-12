with perps_order_committed as (
    {{ get_event_data( -- noqa
        'arbitrum',
        'mainnet',
        'synthetix',
        'perps_market_proxy',
        'order_committed'
    ) }}
)

select
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    contract,
    event_name,
    cast(market_id as UInt128) as market_id,
    cast(account_id as UInt128) as account_id,
    cast(commitment_time as UInt256) as commitment_time,
    cast(expiration_time as UInt256) as expiration_time,
    cast(settlement_time as UInt256) as settlement_time,
    cast(expected_price_time as UInt256) as expected_price_time,
    cast(acceptable_price as UInt256) as acceptable_price,
    cast(order_type as UInt8) as order_type,
    cast(size_delta as Int128) as size_delta,
    sender,
    {{ convert_hex('tracking_code') }} as tracking_code
from
    perps_order_committed
