{{
    config(
        materialized = 'table',
    )
}}

WITH pnl_hourly AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        collateral_value,
        debt,
        hourly_pnl,
        hourly_issuance,
        hourly_debt_migrated,
        rewards_usd,
        hourly_pnl_pct,
        hourly_rewards_pct,
        hourly_total_pct,
        SUM(
            COALESCE(
                hourly_issuance,
                0
            )
        ) over (
            PARTITION BY pool_id,
            collateral_type
            ORDER BY
                ts
        ) AS cumulative_issuance,
        SUM(
            hourly_pnl
        ) over (
            PARTITION BY pool_id,
            collateral_type
            ORDER BY
                ts
        ) AS cumulative_pnl
    FROM
        {{ ref('fct_pool_pnl_hourly_eth_mainnet') }}
),
avg_returns AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        AVG(
            hourly_pnl_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type
            ORDER BY
                ts RANGE BETWEEN INTERVAL '24 HOURS' preceding
                AND CURRENT ROW
        ) AS avg_24h_pnl_pct,
        AVG(
            hourly_pnl_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type
            ORDER BY
                ts RANGE BETWEEN INTERVAL '7 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_7d_pnl_pct,
        AVG(
            hourly_pnl_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type
            ORDER BY
                ts RANGE BETWEEN INTERVAL '28 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_28d_pnl_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type
            ORDER BY
                ts RANGE BETWEEN INTERVAL '24 HOURS' preceding
                AND CURRENT ROW
        ) AS avg_24h_rewards_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type
            ORDER BY
                ts RANGE BETWEEN INTERVAL '7 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_7d_rewards_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type
            ORDER BY
                ts RANGE BETWEEN INTERVAL '28 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_28d_rewards_pct,
        AVG(
            hourly_total_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type
            ORDER BY
                ts RANGE BETWEEN INTERVAL '24 HOURS' preceding
                AND CURRENT ROW
        ) AS avg_24h_total_pct,
        AVG(
            hourly_total_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type
            ORDER BY
                ts RANGE BETWEEN INTERVAL '7 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_7d_total_pct,
        AVG(
            hourly_total_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type
            ORDER BY
                ts RANGE BETWEEN INTERVAL '28 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_28d_total_pct
    FROM
        pnl_hourly
),
apr_calculations AS (
    SELECT
        pnl_hourly.ts AS ts,
        pnl_hourly.pool_id AS pool_id,
        pnl_hourly.collateral_type AS collateral_type,
        pnl_hourly.collateral_value AS collateral_value,
        pnl_hourly.debt AS debt,
        pnl_hourly.hourly_pnl AS hourly_pnl,
        pnl_hourly.cumulative_pnl AS cumulative_pnl,
        pnl_hourly.hourly_issuance AS hourly_issuance,
        pnl_hourly.hourly_debt_migrated AS hourly_debt_migrated,
        pnl_hourly.cumulative_issuance AS cumulative_issuance,
        pnl_hourly.rewards_usd AS rewards_usd,
        pnl_hourly.hourly_pnl_pct AS hourly_pnl_pct,
        pnl_hourly.hourly_rewards_pct AS hourly_rewards_pct,
        -- total pnls
        avg_returns.avg_24h_total_pct * 24 * 365 AS apr_24h,
        avg_returns.avg_7d_total_pct * 24 * 365 AS apr_7d,
        avg_returns.avg_28d_total_pct * 24 * 365 AS apr_28d,
        -- pool pnls
        avg_returns.avg_24h_pnl_pct * 24 * 365 AS apr_24h_pnl,
        avg_returns.avg_7d_pnl_pct * 24 * 365 AS apr_7d_pnl,
        avg_returns.avg_28d_pnl_pct * 24 * 365 AS apr_28d_pnl,
        -- rewards pnls
        avg_returns.avg_24h_rewards_pct * 24 * 365 AS apr_24h_rewards,
        avg_returns.avg_7d_rewards_pct * 24 * 365 AS apr_7d_rewards,
        avg_returns.avg_28d_rewards_pct * 24 * 365 AS apr_28d_rewards
    FROM
        pnl_hourly
        JOIN avg_returns
        ON pnl_hourly.ts = avg_returns.ts
        AND pnl_hourly.pool_id = avg_returns.pool_id
        AND pnl_hourly.collateral_type = avg_returns.collateral_type
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
    pool_id,
    collateral_type,
    collateral_value,
    debt,
    hourly_issuance,
    hourly_debt_migrated,
    hourly_pnl,
    cumulative_pnl,
    cumulative_issuance,
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
    ts
