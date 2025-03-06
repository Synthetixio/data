with delegated as (
    select
        ts,
        account_id,
        change_in_amount,
        last_value(cumulative_amount) over (partition by date_trunc('month', ts) order by ts rows between unbounded preceding and unbounded following) as last_cumulative_amount,
        last_value(cumulative_value) over (partition by date_trunc('month', ts) order by ts rows between unbounded preceding and unbounded following) as last_cumulative_value
    from {{ ref('fct_pol_delegated_cross_chains') }}
),

dim as (
    select
        generate_series(
            date_trunc('month', min(ts)),
            date_trunc('month', max(ts)),
            interval '1 month'
        ) as ts
    from delegated
),

monthly_aggregates as (
    select
        date_trunc('month', delegated.ts) as ts,
        sum(change_in_amount) as monthly_change_in_amount,
        count(distinct account_id) as monthly_account_count,
        max(delegated.last_cumulative_amount) as monthly_cumulative_amount,
        max(delegated.last_cumulative_value) as monthly_cumulative_value
    from delegated
    group by date_trunc('month', delegated.ts)
),

monthly_aggregates_ff as (
    select
        dim.ts,
        coalesce(monthly_aggregates.monthly_change_in_amount, 0) as monthly_change_in_amount,
        last(monthly_aggregates.monthly_cumulative_amount) over (order by dim.ts) as monthly_cumulative_amount,
        last(monthly_aggregates.monthly_cumulative_value) over (order by dim.ts) as monthly_cumulative_value,
        coalesce(monthly_aggregates.monthly_account_count, 0) as monthly_account_count
    from dim
    left join monthly_aggregates
        on date_trunc('month', dim.ts) = monthly_aggregates.ts
)

select
    ts,
    monthly_change_in_amount,
    monthly_cumulative_amount,
    monthly_cumulative_value,
    monthly_account_count
from monthly_aggregates_ff
