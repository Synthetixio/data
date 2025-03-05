with monthly_stats_eth as (
    select
        ts,
        monthly_change_in_amount,
        monthly_cumulative_amount,
        monthly_cumulative_value,
        monthly_account_count
    from {{ ref('fct_pol_stats_monthly_eth_mainnet') }}
),

monthly_stats_optimism as (
    select
        ts,
        monthly_change_in_amount,
        monthly_cumulative_amount,
        monthly_cumulative_value,
        monthly_account_count
    from {{ ref('fct_pol_stats_monthly_optimism_mainnet') }}
)

select
    coalesce(eth.ts, op.ts) as ts,
    coalesce(eth.monthly_change_in_amount, 0) + coalesce(op.monthly_change_in_amount, 0) as monthly_change_in_amount,
    coalesce(eth.monthly_cumulative_amount, 0) + coalesce(op.monthly_cumulative_amount, 0) as monthly_cumulative_amount,
    coalesce(eth.monthly_cumulative_value, 0) + coalesce(op.monthly_cumulative_value, 0) as monthly_cumulative_value,
    coalesce(eth.monthly_account_count, 0) + coalesce(op.monthly_account_count, 0) as monthly_account_count
from monthly_stats_eth as eth
full outer join monthly_stats_optimism as op
    on eth.ts = op.ts
