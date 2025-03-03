with arbitrum as (
    select
        pos.id,
        pos.block_timestamp as ts,
        pos.block_number,
        pos.transaction_hash,
        pos.contract,
        pos.market_id,
        markets.market_symbol,
        CAST(
            pos.account_id as text
        ) as account_id,
        {{ convert_wei('fill_price') }} as fill_price,
        {{ convert_wei('pnl') }} as pnl,
        {{ convert_wei('accrued_funding') }} as accrued_funding,
        {{ convert_wei('size_delta') }} as trade_size,
        {{ convert_wei('new_size') }} as position_size,
        {{ convert_wei('total_fees') }} as total_fees,
        {{ convert_wei('referral_fees') }} as referral_fees,
        {{ convert_wei('collected_fees') }} as collected_fees,
        {{ convert_wei('settlement_reward') }} as settlement_reward,
        {{ convert_hex('tracking_code') }} as tracking_code,
        pos.settler
    from
        {{ ref('perp_order_settled_arbitrum_sepolia') }} as pos
    left join {{ ref('fct_perp_markets_arbitrum_sepolia') }} as markets
        on pos.market_id = markets.id
)

select
    *,
    ABS(
        fill_price * trade_size
    ) as notional_trade_size,
    fill_price * position_size as notional_position_size,
    total_fees - referral_fees - collected_fees - settlement_reward as lp_fees,
    total_fees - settlement_reward as exchange_fees
from
    arbitrum
