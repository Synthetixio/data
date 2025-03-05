with daily_stats_eth as (
    select
        ts,
        daily_change_in_amount,
        daily_cumulative_amount,
        daily_cumulative_value,
        daily_account_count
    from {{ ref('fct_pol_stats_daily_eth_mainnet') }}
),

daily_stats_optimism as (
    select
        ts,
        daily_change_in_amount,
        daily_cumulative_amount,
        daily_cumulative_value,
        daily_account_count
    from {{ ref('fct_pol_stats_daily_optimism_mainnet') }}
)

select
    coalesce(eth.ts, op.ts) as ts,
    coalesce(eth.daily_change_in_amount, 0) + coalesce(op.daily_change_in_amount, 0) as daily_change_in_amount,
    coalesce(eth.daily_cumulative_amount, 0) + coalesce(op.daily_cumulative_amount, 0) as daily_cumulative_amount,
    coalesce(eth.daily_cumulative_value, 0) + coalesce(op.daily_cumulative_value, 0) as daily_cumulative_value,
    coalesce(eth.daily_account_count, 0) + coalesce(op.daily_account_count, 0) as daily_account_count
from daily_stats_eth as eth
full outer join daily_stats_optimism as op
    on eth.ts = op.ts
