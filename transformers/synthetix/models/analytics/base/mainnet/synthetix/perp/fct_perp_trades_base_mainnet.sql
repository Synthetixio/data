{{ 
    config(
        materialized = "view",
        tags = ["perp", "trades", "base", "mainnet"]
    ) 
}}

with base as (
    select
        pos.id as id,
        pos.block_timestamp as ts,
        pos.block_number as block_number,
        pos.transaction_hash as transaction_hash,
        pos.contract as contract,
        pos.market_id as market_id,
        markets.market_symbol as market_symbol,
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
        {{ ref('perp_order_settled_base_mainnet') }} as pos
    left join {{ ref('fct_perp_markets_base_mainnet') }} as markets
        on pos.market_id = markets.id
)

select
    id,
    ts,
    block_number,
    transaction_hash,
    contract,
    market_id,
    market_symbol,
    account_id,
    fill_price,
    pnl,
    accrued_funding,
    trade_size,
    position_size,
    total_fees,
    referral_fees,
    collected_fees,
    settlement_reward,
    tracking_code,
    settler,
    ABS(
        fill_price * trade_size
    ) as notional_trade_size,
    fill_price * position_size as notional_position_size,
    total_fees - referral_fees - collected_fees - settlement_reward as lp_fees,
    total_fees - settlement_reward as exchange_fees
from
    base