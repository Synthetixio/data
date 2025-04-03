{{
    config(
        materialized = 'table',
        unique_key = ['ts', 'pool_id', 'collateral_type', 'reward_token'],
        engine = 'MergeTree',
        tags = ["analytics", "apr", "rewards", "base", "mainnet"],
    )
}}

with pnl_hourly as (
    select
        ts,
        pool_id,
        collateral_type,
        reward_token,
        collateral_value,
        rewards_usd,
        hourly_rewards_pct
    from
        {{ ref('fct_pool_pnl_hourly_reward_base_mainnet') }}
),

avg_returns as (
    select
        ts,
        pool_id,
        collateral_type,
        reward_token,
        AVG(
            hourly_rewards_pct
        ) over (
            partition by
                pool_id,
                collateral_type,
                reward_token
            order by
                ts
            range between 60*60*24 preceding
            and current row
        ) as avg_24h_rewards_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            partition by
                pool_id,
                collateral_type,
                reward_token
            order by
                ts
            range between 60*60*24*7 preceding
            and current row
        ) as avg_7d_rewards_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            partition by
                pool_id,
                collateral_type,
                reward_token
            order by
                ts
            range between 60*60*24*28 preceding
            and current row
        ) as avg_28d_rewards_pct
    from
        pnl_hourly
),

apr_calculations as (
    select
        pnl_hourly.ts,
        pnl_hourly.pool_id,
        pnl_hourly.collateral_type,
        pnl_hourly.reward_token,
        pnl_hourly.collateral_value,
        pnl_hourly.rewards_usd,
        pnl_hourly.hourly_rewards_pct,
        avg_returns.avg_24h_rewards_pct * 24 * 365 as apr_24h_rewards,
        avg_returns.avg_7d_rewards_pct * 24 * 365 as apr_7d_rewards,
        avg_returns.avg_28d_rewards_pct * 24 * 365 as apr_28d_rewards
    from
        pnl_hourly
    inner join avg_returns
        on
            pnl_hourly.ts = avg_returns.ts
            and pnl_hourly.pool_id = avg_returns.pool_id
            and pnl_hourly.collateral_type = avg_returns.collateral_type
            and pnl_hourly.reward_token = avg_returns.reward_token
),

apy_calculations as (
    select
        *,
        (POWER(1 + apr_24h_rewards / 8760, 8760) - 1) as apy_24h_rewards,
        (POWER(1 + apr_7d_rewards / 8760, 8760) - 1) as apy_7d_rewards,
        (POWER(1 + apr_28d_rewards / 8760, 8760) - 1) as apy_28d_rewards
    from
        apr_calculations
)

select
    ts,
    pool_id,
    collateral_type,
    reward_token,
    collateral_value,
    rewards_usd,
    hourly_rewards_pct,
    apr_24h_rewards,
    apy_24h_rewards,
    apr_7d_rewards,
    apy_7d_rewards,
    apr_28d_rewards,
    apy_28d_rewards
from
    apy_calculations
order by
    ts
