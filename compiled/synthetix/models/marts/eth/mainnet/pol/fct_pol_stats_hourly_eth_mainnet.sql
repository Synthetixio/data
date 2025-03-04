with delegated as (
    select
        ts,
        account_id,
        change_in_amount,
        cumulative_amount,
        cumulative_value,
        price
    from "analytics"."prod_eth_mainnet"."fct_pol_delegated_eth_mainnet"
    order by ts asc
),

hourly_aggregates as (
    select
        date_trunc('hour', delegated.ts) as ts,
        sum(change_in_amount) as hourly_change_in_amount,
        count(distinct account_id) as hourly_account_count,
        last(delegated.cumulative_amount) as hourly_cumulative_amount,
        last(delegated.cumulative_value) as hourly_cumulative_value,
        last(delegated.price) as hourly_price
    from delegated
    group by date_trunc('hour', delegated.ts)
)

select
    ts,
    hourly_change_in_amount,
    hourly_cumulative_amount,
    hourly_cumulative_value,
    hourly_price,
    hourly_account_count
from hourly_aggregates