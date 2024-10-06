with perps_previous_order_expired as (
    {{ get_event_data(
        'arbitrum',
        'sepolia',
        'perps_market_proxy',
        'previous_order_expired'
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
    cast(account_id as UInt128) as account_id,
    cast(size_delta as Int128) as size_delta,
    cast(acceptable_price as UInt256) as acceptable_price,
    cast(commitment_time as UInt256) as commitment_time,
    {{ convert_hex('tracking_code') }} as tracking_code
from perps_previous_order_expired
