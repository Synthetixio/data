with delegated as (
    select
        ts,
        account_id,
        change_in_amount,
        cumulative_amount,
        cumulative_value,
        price
    from {{ ref('fct_pol_delegated_optimism_mainnet') }}
    order by ts asc
),

monthly_aggregates as (
    select
        date_trunc('month', delegated.ts) as ts,
        sum(change_in_amount) as monthly_change_in_amount,
        count(distinct account_id) as monthly_account_count,
        last(delegated.cumulative_amount) as monthly_cumulative_amount,
        last(delegated.cumulative_value) as monthly_cumulative_value,
        last(delegated.price) as monthly_price
    from delegated
    group by date_trunc('month', delegated.ts)
)

select
    ts,
    monthly_change_in_amount,
    monthly_cumulative_amount,
    monthly_cumulative_value,
    monthly_price,
    monthly_account_count
from monthly_aggregates
