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

weekly_aggregates as (
    select
        date_trunc('week', delegated.ts) as ts,
        sum(change_in_amount) as weekly_change_in_amount,
        count(distinct account_id) as weekly_account_count,
        last(delegated.cumulative_amount) as weekly_cumulative_amount,
        last(delegated.cumulative_value) as weekly_cumulative_value,
        last(delegated.price) as weekly_price
    from delegated
    group by date_trunc('week', delegated.ts)
)

select
    ts,
    weekly_change_in_amount,
    weekly_cumulative_amount,
    weekly_cumulative_value,
    weekly_price,
    weekly_account_count
from weekly_aggregates
