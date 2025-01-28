{{ 
    config(
        materialized = "view",
        tags = ["perp", "account_stats", "daily", "base", "mainnet"]
    )
}}

with daily as (
    select
        DATE_TRUNC(
            'day',
            ts
        ) as day_ts,
        account_id,
        SUM(fees) as fees,
        SUM(volume) as volume,
        SUM(amount_liquidated) as amount_liquidated,
        SUM(liquidations) as liquidations
    from
        {{ ref('fct_perp_account_stats_hourly_base_mainnet') }}
    group by
        day_ts,
        account_id
),

stats as (
    select
        day_ts,
        account_id,
        fees,
        volume,
        amount_liquidated,
        liquidations,
        SUM(fees) over (
            partition by account_id
            order by
                day_ts
            range between unbounded preceding
            and current row
        ) as cumulative_fees,
        SUM(volume) over (
            partition by account_id
            order by
                day_ts
            range between unbounded preceding
            and current row
        ) as cumulative_volume
    from
        daily
)

select
    day_ts as ts,
    account_id,
    fees,
    volume,
    amount_liquidated,
    liquidations,
    cumulative_fees,
    cumulative_volume
from
    stats
