with base as (
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
        
    fill_price / 1e18
 as fill_price,
        
    pnl / 1e18
 as pnl,
        
    accrued_funding / 1e18
 as accrued_funding,
        
    size_delta / 1e18
 as trade_size,
        
    new_size / 1e18
 as position_size,
        
    total_fees / 1e18
 as total_fees,
        
    referral_fees / 1e18
 as referral_fees,
        
    collected_fees / 1e18
 as collected_fees,
        
    settlement_reward / 1e18
 as settlement_reward,
        
    LEFT(
        REGEXP_REPLACE(
            encode(
                DECODE(REPLACE(tracking_code, '0x', ''), 'hex'),
                'escape'
            ) :: text,
            '\\000',
            '',
            'g'
        ),
        20
    )
 as tracking_code,
        pos.settler
    from
        "analytics"."prod_raw_base_sepolia"."perp_order_settled_base_sepolia" as pos
    left join "analytics"."prod_base_sepolia"."fct_perp_markets_base_sepolia" as markets
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
    base