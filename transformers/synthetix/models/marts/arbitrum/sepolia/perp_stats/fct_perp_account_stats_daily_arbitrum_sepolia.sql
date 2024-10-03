with daily as (
    select
        DATE_TRUNC(
            'day',
            ts
        ) as daily_ts,
        account_id,
        SUM(fees) as fees,
        SUM(volume) as volume,
        SUM(amount_liquidated) as amount_liquidated,
        SUM(liquidations) as liquidations
    from
        {{ ref('fct_perp_account_stats_hourly_arbitrum_sepolia') }}
    group by
        daily_ts,
        account_id
),

stats as (
    select
        *,
        SUM(fees) over (
            partition by account_id
            order by
                daily_ts
            range between unbounded preceding
            and current row
        ) as cumulative_fees,
        SUM(volume) over (
            partition by account_id
            order by
                daily_ts
            range between unbounded preceding
            and current row
        ) as cumulative_volume
    from
        daily
)

select *
from
    stats
