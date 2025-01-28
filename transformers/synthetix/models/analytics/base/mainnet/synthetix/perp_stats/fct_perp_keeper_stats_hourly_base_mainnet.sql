{{ config(
    materialized = "view",
    tags = ["perp", "keeper_stats", "hourly", "base", "mainnet"]
) }}

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
        {{ ref('fct_perp_trades_base_mainnet') }}
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
        ts
)

select
    trades.ts,
    trades.settler as keeper,
    SUM(trades.trades) as trades,
    SUM(trades.settlement_reward) as settlement_rewards,
    SUM(trades.notional_trade_size) as amount_settled,
    SUM(trades.trades) / MAX(total.trades_total) as trades_pct,
    SUM(trades.settlement_reward)
    / MAX(total.settlement_reward_total) as settlement_rewards_pct,
    SUM(trades.notional_trade_size)
    / MAX(total.notional_trade_size_total) as amount_settled_pct
from
    trades
inner join total
    on trades.ts = total.ts
group by
    trades.ts,
    trades.settler