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
        {{ ref('fct_perp_keeper_stats_hourly_base_sepolia') }}
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
        1
)

select
    hourly.ts,
    keeper,
    SUM(trades) as trades,
    SUM(settlement_rewards) as settlement_rewards,
    SUM(amount_settled) as amount_settled,
    SUM(trades) / MAX(trades_total) as trades_pct,
    SUM(settlement_rewards)
    / MAX(settlement_reward_total) as settlement_rewards_pct,
    SUM(amount_settled) / MAX(amount_settled_total) as amount_settled_pct
from
    hourly
inner join total
    on hourly.ts = total.ts
group by
    1,
    2
