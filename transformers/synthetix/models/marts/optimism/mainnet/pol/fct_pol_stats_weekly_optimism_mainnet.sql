with delegated as (
    select
        ts,
        account_id,
        change_in_amount,
        last_value(cumulative_amount) over (partition by date_trunc('week', ts) order by ts rows between unbounded preceding and unbounded following) as last_cumulative_amount,
        last_value(cumulative_value) over (partition by date_trunc('week', ts) order by ts rows between unbounded preceding and unbounded following) as last_cumulative_value
    from {{ ref('fct_pol_delegated_optimism_mainnet') }}
),

dim as (
    select
        generate_series(
            date_trunc('week', min(ts)),
            date_trunc('week', max(ts)),
            interval '1 week'
        ) as ts
    from delegated
),

weekly_aggregates as (
    select
        date_trunc('week', delegated.ts) as ts,
        sum(change_in_amount) as weekly_change_in_amount,
        count(distinct account_id) as weekly_account_count,
        max(delegated.last_cumulative_amount) as weekly_cumulative_amount,
        max(delegated.last_cumulative_value) as weekly_cumulative_value
    from delegated
    group by date_trunc('week', delegated.ts)
),

weekly_aggregates_ff as (
    select
        dim.ts,
        coalesce(weekly_aggregates.weekly_change_in_amount, 0) as weekly_change_in_amount,
        last(weekly_aggregates.weekly_cumulative_amount) over (order by dim.ts) as weekly_cumulative_amount,
        last(weekly_aggregates.weekly_cumulative_value) over (order by dim.ts) as weekly_cumulative_value,
        coalesce(weekly_aggregates.weekly_account_count, 0) as weekly_account_count
    from dim
    left join weekly_aggregates
        on date_trunc('week', dim.ts) = weekly_aggregates.ts
)

select
    ts,
    weekly_change_in_amount,
    weekly_cumulative_amount,
    weekly_cumulative_value,
    weekly_account_count
from weekly_aggregates_ff
