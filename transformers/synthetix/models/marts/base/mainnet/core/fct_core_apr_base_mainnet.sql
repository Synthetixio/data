{{
    config(
        materialized = 'table',
    )
}}

with pnl_hourly as (
    select
        ts,
        pool_id,
        collateral_type,
        collateral_value,
        debt,
        hourly_pnl,
        hourly_issuance,
        rewards_usd,
        liquidation_rewards_usd,
        hourly_pnl_pct,
        hourly_rewards_pct,
        hourly_total_pct,
        sum(coalesce(hourly_issuance, 0)) over (
            partition by pool_id, collateral_type
            order by ts
        ) as cumulative_issuance,
        sum(hourly_pnl) over (
            partition by pool_id, collateral_type
            order by ts
        ) as cumulative_pnl,
        sum(liquidation_rewards_usd) over (
            partition by pool_id, collateral_type
            order by ts
        ) as cumulative_liquidation_rewards
    from {{ ref('fct_pool_pnl_hourly_base_mainnet') }}
),

avg_returns as (
    select
        ts,
        pool_id,
        collateral_type,
        avg(hourly_pnl_pct) over (
            partition by pool_id, collateral_type
            order by ts
            range between interval '24 HOURS' preceding and current row
        ) as avg_24h_pnl_pct,
        avg(hourly_pnl_pct) over (
            partition by pool_id, collateral_type
            order by ts
            range between interval '7 DAYS' preceding and current row
        ) as avg_7d_pnl_pct,
        avg(hourly_pnl_pct) over (
            partition by pool_id, collateral_type
            order by ts
            range between interval '28 DAYS' preceding and current row
        ) as avg_28d_pnl_pct,
        avg(hourly_rewards_pct) over (
            partition by pool_id, collateral_type
            order by ts
            range between interval '24 HOURS' preceding and current row
        ) as avg_24h_rewards_pct,
        avg(hourly_rewards_pct) over (
            partition by pool_id, collateral_type
            order by ts
            range between interval '7 DAYS' preceding and current row
        ) as avg_7d_rewards_pct,
        avg(hourly_rewards_pct) over (
            partition by pool_id, collateral_type
            order by ts
            range between interval '28 DAYS' preceding and current row
        ) as avg_28d_rewards_pct,
        avg(hourly_total_pct) over (
            partition by pool_id, collateral_type
            order by ts
            range between interval '24 HOURS' preceding and current row
        ) as avg_24h_total_pct,
        avg(hourly_total_pct) over (
            partition by pool_id, collateral_type
            order by ts
            range between interval '7 DAYS' preceding and current row
        ) as avg_7d_total_pct,
        avg(hourly_total_pct) over (
            partition by pool_id, collateral_type
            order by ts
            range between interval '28 DAYS' preceding and current row
        ) as avg_28d_total_pct
    from pnl_hourly
),

apr_calculations as (
    select
        pnl_hourly.ts,
        pnl_hourly.pool_id,
        pnl_hourly.collateral_type,
        pnl_hourly.collateral_value,
        pnl_hourly.debt,
        pnl_hourly.hourly_pnl,
        pnl_hourly.cumulative_pnl,
        pnl_hourly.cumulative_liquidation_rewards,
        pnl_hourly.hourly_issuance,
        pnl_hourly.cumulative_issuance,
        pnl_hourly.rewards_usd,
        pnl_hourly.liquidation_rewards_usd,
        pnl_hourly.hourly_pnl_pct,
        pnl_hourly.hourly_rewards_pct,
        -- total pnls
        avg_returns.avg_24h_total_pct * 24 * 365 as apr_24h,
        avg_returns.avg_7d_total_pct * 24 * 365 as apr_7d,
        avg_returns.avg_28d_total_pct * 24 * 365 as apr_28d,
        -- pool pnls
        avg_returns.avg_24h_pnl_pct * 24 * 365 as apr_24h_pnl,
        avg_returns.avg_7d_pnl_pct * 24 * 365 as apr_7d_pnl,
        avg_returns.avg_28d_pnl_pct * 24 * 365 as apr_28d_pnl,
        -- rewards pnls
        avg_returns.avg_24h_rewards_pct * 24 * 365 as apr_24h_rewards,
        avg_returns.avg_7d_rewards_pct * 24 * 365 as apr_7d_rewards,
        avg_returns.avg_28d_rewards_pct * 24 * 365 as apr_28d_rewards,
        -- underlying yields
        coalesce(yr.apr_24h_underlying, 0) as apr_24h_underlying,
        coalesce(yr.apr_7d_underlying, 0) as apr_7d_underlying,
        coalesce(yr.apr_28d_underlying, 0) as apr_28d_underlying
    from pnl_hourly
    inner join avg_returns
        on
            pnl_hourly.ts = avg_returns.ts
            and pnl_hourly.pool_id = avg_returns.pool_id
            and pnl_hourly.collateral_type = avg_returns.collateral_type
    left join {{ ref('fct_token_yields_base_mainnet') }} as yr
        on
            pnl_hourly.ts = yr.ts
            and pnl_hourly.pool_id = yr.pool_id
            and pnl_hourly.collateral_type = yr.collateral_type
),

apy_calculations as (
    select
        *,
        (power(1 + apr_24h / 8760, 8760) - 1) as apy_24h,
        (power(1 + apr_7d / 8760, 8760) - 1) as apy_7d,
        (power(1 + apr_28d / 8760, 8760) - 1) as apy_28d,
        (power(1 + apr_24h_pnl / 8760, 8760) - 1) as apy_24h_pnl,
        (power(1 + apr_7d_pnl / 8760, 8760) - 1) as apy_7d_pnl,
        (power(1 + apr_28d_pnl / 8760, 8760) - 1) as apy_28d_pnl,
        (power(1 + apr_24h_rewards / 8760, 8760) - 1) as apy_24h_rewards,
        (power(1 + apr_7d_rewards / 8760, 8760) - 1) as apy_7d_rewards,
        (power(1 + apr_28d_rewards / 8760, 8760) - 1) as apy_28d_rewards,
        (power(1 + apr_24h_underlying / 8760, 8760) - 1) as apy_24h_underlying,
        (power(1 + apr_7d_underlying / 8760, 8760) - 1) as apy_7d_underlying,
        (power(1 + apr_28d_underlying / 8760, 8760) - 1) as apy_28d_underlying
    from apr_calculations
)

select
    ts,
    pool_id,
    collateral_type,
    collateral_value,
    debt,
    hourly_issuance,
    hourly_pnl,
    cumulative_pnl,
    cumulative_liquidation_rewards,
    cumulative_issuance,
    rewards_usd,
    liquidation_rewards_usd,
    hourly_pnl_pct,
    hourly_rewards_pct,
    apr_24h,
    apy_24h,
    apr_7d,
    apy_7d,
    apr_28d,
    apy_28d,
    apr_24h_pnl,
    apy_24h_pnl,
    apr_7d_pnl,
    apy_7d_pnl,
    apr_28d_pnl,
    apy_28d_pnl,
    apr_24h_rewards,
    apy_24h_rewards,
    apr_7d_rewards,
    apy_7d_rewards,
    apr_28d_rewards,
    apy_28d_rewards,
    apr_24h_underlying,
    apy_24h_underlying,
    apr_7d_underlying,
    apy_7d_underlying,
    apr_28d_underlying,
    apy_28d_underlying
from apy_calculations
order by ts
