WITH pnl_hourly AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        reward_token,
        collateral_value,
        rewards_usd,
        hourly_rewards_pct
    FROM
        {{ ref('fct_pool_pnl_hourly_reward_base_mainnet') }}
),
avg_returns AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        reward_token,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type,
            reward_token
            ORDER BY
                ts RANGE BETWEEN INTERVAL '24 HOURS' preceding
                AND CURRENT ROW
        ) AS avg_24h_rewards_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type,
            reward_token
            ORDER BY
                ts RANGE BETWEEN INTERVAL '7 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_7d_rewards_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type,
            reward_token
            ORDER BY
                ts RANGE BETWEEN INTERVAL '28 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_28d_rewards_pct
    FROM
        pnl_hourly
),
apr_calculations AS (
    SELECT
        pnl_hourly.ts AS ts,
        pnl_hourly.pool_id AS pool_id,
        pnl_hourly.collateral_type AS collateral_type,
        pnl_hourly.reward_token AS reward_token,
        pnl_hourly.collateral_value AS collateral_value,
        pnl_hourly.rewards_usd AS rewards_usd,
        pnl_hourly.hourly_rewards_pct AS hourly_rewards_pct,
        avg_returns.avg_24h_rewards_pct * 24 * 365 AS apr_24h_rewards,
        avg_returns.avg_7d_rewards_pct * 24 * 365 AS apr_7d_rewards,
        avg_returns.avg_28d_rewards_pct * 24 * 365 AS apr_28d_rewards
    FROM
        pnl_hourly
        JOIN avg_returns
        ON pnl_hourly.ts = avg_returns.ts
        AND pnl_hourly.pool_id = avg_returns.pool_id
        AND pnl_hourly.collateral_type = avg_returns.collateral_type
        AND pnl_hourly.reward_token = avg_returns.reward_token
),
apy_calculations AS (
    SELECT
        *,
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
FROM
    apy_calculations
ORDER BY
    ts
