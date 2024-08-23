with trades as (
    select
        settler,
        settlement_reward,
        notional_trade_size,
        1 as trades,
        DATE_TRUNC(
            'hour',
            ts
        ) as ts
    from
        {{ ref('fct_perp_trades_base_sepolia') }}
),

total as (
    select
        ts,
        SUM(trades) as trades_total,
        SUM(settlement_reward) as settlement_reward_total,
        SUM(notional_trade_size) as notional_trade_size_total
    from
        trades
    group by
        1
)

select
    trades.ts,
    settler as keeper,
    SUM(trades) as trades,
    SUM(settlement_reward) as settlement_rewards,
    SUM(notional_trade_size) as amount_settled,
    SUM(trades) / MAX(trades_total) as trades_pct,
    SUM(settlement_reward)
    / MAX(settlement_reward_total) as settlement_rewards_pct,
    SUM(notional_trade_size)
    / MAX(notional_trade_size_total) as amount_settled_pct
from
    trades
inner join total
    on trades.ts = total.ts
group by
    1,
    2
