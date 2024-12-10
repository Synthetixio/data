with daily as (
    select
        DATE_TRUNC(
            'day',
            ts
        ) as ts,
        account_id,
        SUM(fees) as fees,
        SUM(volume) as volume,
        SUM(amount_liquidated) as amount_liquidated,
        SUM(liquidations) as liquidations
    from
        "analytics"."prod_base_sepolia"."fct_perp_account_stats_hourly_base_sepolia"
    group by
        DATE_TRUNC(
            'day',
            ts
        ),
        account_id
),

stats as (
    select
        *,
        SUM(fees) over (
            partition by account_id
            order by
                ts
            range between unbounded preceding
            and current row
        ) as cumulative_fees,
        SUM(volume) over (
            partition by account_id
            order by
                ts
            range between unbounded preceding
            and current row
        ) as cumulative_volume
    from
        daily
)

select *
from
    stats