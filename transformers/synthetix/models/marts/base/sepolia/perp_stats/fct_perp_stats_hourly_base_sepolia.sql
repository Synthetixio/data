with inc_market as (
    select
        ts,
        market_symbol,
        trades,
        exchange_fees,
        referral_fees,
        collected_fees,
        volume,
        liquidations,
        cumulative_exchange_fees,
        cumulative_referral_fees,
        cumulative_collected_fees,
        cumulative_volume
    from
        {{ ref('fct_perp_market_stats_hourly_base_sepolia') }}
),

liq as (
    select
        ts,
        total_reward,
        1 as liquidated_accounts
    from
        {{ ref('fct_perp_liq_account_base_sepolia') }}
),

inc_liq as (
    select
        DATE_TRUNC(
            'hour',
            ts
        ) as ts,
        SUM(total_reward) as liquidation_rewards,
        SUM(liquidated_accounts) as liquidated_accounts
    from
        liq
    group by
        ts
),

inc_trade as (
    select
        ts,
        SUM(trades) as trades,
        SUM(exchange_fees) as exchange_fees,
        SUM(referral_fees) as referral_fees,
        SUM(collected_fees) as collected_fees,
        SUM(volume) as volume,
        SUM(cumulative_exchange_fees) as cumulative_exchange_fees,
        SUM(cumulative_referral_fees) as cumulative_referral_fees,
        SUM(cumulative_collected_fees) as cumulative_collected_fees,
        SUM(cumulative_volume) as cumulative_volume
    from
        inc_market
    group by
        ts
),

inc as (
    select
        h.ts,
        h.trades,
        h.exchange_fees,
        h.referral_fees,
        h.collected_fees,
        h.volume,
        h.cumulative_exchange_fees,
        h.cumulative_referral_fees,
        h.cumulative_collected_fees,
        h.cumulative_volume,
        COALESCE(
            l.liquidation_rewards,
            0
        ) as liquidation_rewards,
        COALESCE(
            l.liquidated_accounts,
            0
        ) as liquidated_accounts
    from
        inc_trade as h
    left join inc_liq as l
        on h.ts = l.ts
)

select *
from
    inc
