with hourly as (
    select
        keeper,
        settlement_rewards,
        amount_settled,
        trades,
        DATE_TRUNC(
            'day',
            ts
        ) as ts
    from
        "analytics"."prod_base_sepolia"."fct_perp_keeper_stats_hourly_base_sepolia"
),

total as (
    select
        ts,
        SUM(trades) as trades_total,
        SUM(settlement_rewards) as settlement_reward_total,
        SUM(amount_settled) as amount_settled_total
    from
        hourly
    group by
        ts
)

select
    hourly.ts,
    hourly.keeper,
    SUM(hourly.trades) as trades,
    SUM(hourly.settlement_rewards) as settlement_rewards,
    SUM(hourly.amount_settled) as amount_settled,
    SUM(hourly.trades) / MAX(total.trades_total) as trades_pct,
    SUM(hourly.settlement_rewards)
    / MAX(total.settlement_reward_total) as settlement_rewards_pct,
    SUM(hourly.amount_settled)
    / MAX(total.amount_settled_total) as amount_settled_pct
from
    hourly
inner join total
    on hourly.ts = total.ts
group by
    hourly.ts,
    hourly.keeper