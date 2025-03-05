with hourly_stats_eth as (
    select
        ts,
        hourly_change_in_amount,
        hourly_cumulative_amount,
        hourly_cumulative_value,
        hourly_account_count
    from {{ ref('fct_pol_stats_hourly_eth_mainnet') }}
),

hourly_stats_optimism as (
    select
        ts,
        hourly_change_in_amount,
        hourly_cumulative_amount,
        hourly_cumulative_value,
        hourly_account_count
    from {{ ref('fct_pol_stats_hourly_optimism_mainnet') }}
)

select
    coalesce(eth.ts, op.ts) as ts,
    coalesce(eth.hourly_change_in_amount, 0) + coalesce(op.hourly_change_in_amount, 0) as hourly_change_in_amount,
    coalesce(eth.hourly_cumulative_amount, 0) + coalesce(op.hourly_cumulative_amount, 0) as hourly_cumulative_amount,
    coalesce(eth.hourly_cumulative_value, 0) + coalesce(op.hourly_cumulative_value, 0) as hourly_cumulative_value,
    coalesce(eth.hourly_account_count, 0) + coalesce(op.hourly_account_count, 0) as hourly_account_count
from hourly_stats_eth as eth
full outer join hourly_stats_optimism as op
    on eth.ts = op.ts
