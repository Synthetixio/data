with perps_order_settled as (
    {{ get_event_data(
        'arbitrum',
        'sepolia',
        'perps_market_proxy',
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
    cast(account_id as UInt128) as account_id,
    cast(fill_price as UInt256) as fill_price,
    cast(pnl as Int256) as pnl,
    cast(accrued_funding as Int256) as accrued_funding,
    cast(size_delta as Int128) as size_delta,
    cast(new_size as Int128) as new_size,
    cast(total_fees as UInt256) as total_fees,
    cast(referral_fees as UInt256) as referral_fees,
    cast(collected_fees as UInt256) as collected_fees,
    cast(settlement_reward as UInt256) as settlement_reward,
    {{ convert_hex('tracking_code') }} as tracking_code,
    settler
from perps_order_settled
