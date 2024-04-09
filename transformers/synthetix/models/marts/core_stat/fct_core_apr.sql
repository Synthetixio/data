WITH pnl_hourly AS (
    SELECT
        ts,
        market_id,
        collateral_value,
        hourly_pnl,
        rewards_usd,
        hourly_pnl_pct,
        hourly_rewards_pct,
        hourly_total_pct,
        avg_24h_pnl_pct,
        avg_24h_rewards_pct,
        avg_24h_total_pct,
        avg_7d_pnl_pct,
        avg_7d_rewards_pct,
        avg_7d_total_pct,
        avg_28d_pnl_pct,
        avg_28d_rewards_pct,
        avg_28d_total_pct
    FROM
        {{ ref('fct_pool_pnl_hourly') }}
),
apr_calculations AS (
    SELECT
        ts,
        market_id,
        collateral_value,
        hourly_pnl,
        rewards_usd,
        hourly_pnl_pct,
        hourly_rewards_pct,
        -- total pnls
        avg_24h_total_pct * 24 * 365 AS apr_24h,
        avg_7d_total_pct * 24 * 365 AS apr_7d,
        avg_28d_total_pct * 24 * 365 AS apr_28d,
        -- pool pnls
        avg_24h_pnl_pct * 24 * 365 AS apr_24h_pnl,
        avg_7d_pnl_pct * 24 * 365 AS apr_7d_pnl,
        avg_28d_pnl_pct * 24 * 365 AS apr_28d_pnl,
        -- rewards pnls
        avg_24h_rewards_pct * 24 * 365 AS apr_24h_rewards,
        avg_7d_rewards_pct * 24 * 365 AS apr_7d_rewards,
        avg_28d_rewards_pct * 24 * 365 AS apr_28d_rewards
    FROM
        pnl_hourly
),
apy_calculations AS (
    SELECT
        *,
        (power(1 + apr_24h / 8760, 8760) - 1) AS apy_24h,
        (power(1 + apr_7d / 8760, 8760) - 1) AS apy_7d,
        (power(1 + apr_28d / 8760, 8760) - 1) AS apy_28d,
        (power(1 + apr_24h_pnl / 8760, 8760) - 1) AS apy_24h_pnl,
        (power(1 + apr_7d_pnl / 8760, 8760) - 1) AS apy_7d_pnl,
        (power(1 + apr_28d_pnl / 8760, 8760) - 1) AS apy_28d_pnl,
        (power(1 + apr_24h_rewards / 8760, 8760) - 1) AS apy_24h_rewards,
        (power(1 + apr_7d_rewards / 8760, 8760) - 1) AS apy_7d_rewards,
        (power(1 + apr_28d_rewards / 8760, 8760) - 1) AS apy_28d_rewards
    FROM
        apr_calculations
)
SELECT
    ts,
    market_id,
    collateral_value,
    hourly_pnl,
    rewards_usd,
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
    apy_28d_rewards
FROM
    apy_calculations
ORDER BY
    market_id,
    ts
