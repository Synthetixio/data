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

daily_aggregates as (
    select
        date_trunc('day', delegated.ts) as ts,
        sum(change_in_amount) as daily_change_in_amount,
        count(distinct account_id) as daily_account_count,
        last(delegated.cumulative_amount) as daily_cumulative_amount,
        last(delegated.cumulative_value) as daily_cumulative_value,
        last(delegated.price) as daily_price
    from delegated
    group by date_trunc('day', delegated.ts)
)

select
    ts,
    daily_change_in_amount,
    daily_cumulative_amount,
    daily_cumulative_value,
    daily_price,
    daily_account_count
from daily_aggregates
