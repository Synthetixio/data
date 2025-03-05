with weekly_stats_eth as (
    select
        ts,
        weekly_change_in_amount,
        weekly_cumulative_amount,
        weekly_cumulative_value,
        weekly_account_count
    from {{ ref('fct_pol_stats_weekly_eth_mainnet') }}
),

weekly_stats_optimism as (
    select
        ts,
        weekly_change_in_amount,
        weekly_cumulative_amount,
        weekly_cumulative_value,
        weekly_account_count
    from {{ ref('fct_pol_stats_weekly_optimism_mainnet') }}
)

select
    coalesce(eth.ts, op.ts) as ts,
    coalesce(eth.weekly_change_in_amount, 0) + coalesce(op.weekly_change_in_amount, 0) as weekly_change_in_amount,
    coalesce(eth.weekly_cumulative_amount, 0) + coalesce(op.weekly_cumulative_amount, 0) as weekly_cumulative_amount,
    coalesce(eth.weekly_cumulative_value, 0) + coalesce(op.weekly_cumulative_value, 0) as weekly_cumulative_value,
    coalesce(eth.weekly_account_count, 0) + coalesce(op.weekly_account_count, 0) as weekly_account_count
from weekly_stats_eth as eth
full outer join weekly_stats_optimism as op
    on eth.ts = op.ts
