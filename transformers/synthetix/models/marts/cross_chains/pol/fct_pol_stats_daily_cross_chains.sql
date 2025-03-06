with delegated as (
    select
        ts,
        account_id,
        change_in_amount,
        last_value(cumulative_amount) over (partition by date_trunc('day', ts) order by ts rows between unbounded preceding and unbounded following) as last_cumulative_amount,
        last_value(cumulative_value) over (partition by date_trunc('day', ts) order by ts rows between unbounded preceding and unbounded following) as last_cumulative_value
    from {{ ref('fct_pol_delegated_cross_chains') }}
),

dim as (
    select
        generate_series(
            date_trunc('day', min(ts)),
            date_trunc('day', max(ts)),
            interval '1 day'
        ) as ts
    from delegated
),

daily_aggregates as (
    select
        date_trunc('day', delegated.ts) as ts,
        sum(change_in_amount) as daily_change_in_amount,
        count(distinct account_id) as daily_account_count,
        max(delegated.last_cumulative_amount) as daily_cumulative_amount,
        max(delegated.last_cumulative_value) as daily_cumulative_value
    from delegated
    group by date_trunc('day', delegated.ts)
),

daily_aggregates_ff as (
    select
        dim.ts,
        coalesce(daily_aggregates.daily_change_in_amount, 0) as daily_change_in_amount,
        last(daily_aggregates.daily_cumulative_amount) over (order by dim.ts) as daily_cumulative_amount,
        last(daily_aggregates.daily_cumulative_value) over (order by dim.ts) as daily_cumulative_value,
        coalesce(daily_aggregates.daily_account_count, 0) as daily_account_count
    from dim
    left join daily_aggregates
        on date_trunc('day', dim.ts) = daily_aggregates.ts
)

select
    ts,
    daily_change_in_amount,
    daily_cumulative_amount,
    daily_cumulative_value,
    daily_account_count
from daily_aggregates_ff
