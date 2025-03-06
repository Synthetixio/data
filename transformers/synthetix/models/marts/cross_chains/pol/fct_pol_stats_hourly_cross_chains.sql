with delegated as (
    select
        ts,
        account_id,
        change_in_amount,
        last_value(cumulative_amount) over (partition by date_trunc('hour', ts) order by ts rows between unbounded preceding and unbounded following) as last_cumulative_amount,
        last_value(cumulative_value) over (partition by date_trunc('hour', ts) order by ts rows between unbounded preceding and unbounded following) as last_cumulative_value
    from {{ ref('fct_pol_delegated_cross_chains') }}
),

dim as (
    select
        generate_series(
            date_trunc('hour', min(ts)),
            date_trunc('hour', max(ts)),
            interval '1 hour'
        ) as ts
    from delegated
),

hourly_aggregates as (
    select
        date_trunc('hour', delegated.ts) as ts,
        sum(change_in_amount) as hourly_change_in_amount,
        count(distinct account_id) as hourly_account_count,
        max(delegated.last_cumulative_amount) as hourly_cumulative_amount,
        max(delegated.last_cumulative_value) as hourly_cumulative_value
    from delegated
    group by date_trunc('hour', delegated.ts)
),

hourly_aggregates_ff as (
    select
        dim.ts,
        coalesce(hourly_aggregates.hourly_change_in_amount, 0) as hourly_change_in_amount,
        last(hourly_aggregates.hourly_cumulative_amount) over (order by dim.ts) as hourly_cumulative_amount,
        last(hourly_aggregates.hourly_cumulative_value) over (order by dim.ts) as hourly_cumulative_value,
        coalesce(hourly_aggregates.hourly_account_count, 0) as hourly_account_count
    from dim
    left join hourly_aggregates
        on date_trunc('hour', dim.ts) = hourly_aggregates.ts
)

select
    ts,
    hourly_change_in_amount,
    hourly_cumulative_amount,
    hourly_cumulative_value,
    hourly_account_count
from hourly_aggregates_ff
