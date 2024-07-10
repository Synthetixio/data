WITH dim AS (

    SELECT
        generate_series(DATE_TRUNC('hour', MIN(t.ts)), DATE_TRUNC('hour', MAX(t.ts)), '1 hour' :: INTERVAL) AS ts,
        p.pool_id,
        p.collateral_type,
        p.token_symbol
    FROM
        (
            SELECT
                ts
            FROM
                {{ ref('fct_pool_debt_arbitrum_sepolia') }}
        ) AS t
        CROSS JOIN (
            SELECT
                DISTINCT pool_id,
                collateral_type,
                token_symbol
            FROM
                {{ ref('fct_pool_rewards_token_hourly_arbitrum_sepolia') }}
        ) AS p
GROUP BY
    p.pool_id,
    p.collateral_type,
    p.token_symbol
),
debt AS (
    SELECT
        DISTINCT DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        pool_id,
        collateral_type,
        LAST_VALUE(debt) over (PARTITION BY DATE_TRUNC('hour', ts), pool_id, collateral_type
    ORDER BY
        ts rows BETWEEN unbounded preceding
        AND unbounded following) AS debt
    FROM
        {{ ref('fct_pool_debt_arbitrum_sepolia') }}
),
collateral AS (
    SELECT
        DISTINCT DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        pool_id,
        collateral_type,
        LAST_VALUE(collateral_value) over (PARTITION BY DATE_TRUNC('hour', ts), pool_id, collateral_type
    ORDER BY
        ts rows BETWEEN unbounded preceding
        AND unbounded following) AS collateral_value
    FROM
        {{ ref('core_vault_collateral_arbitrum_sepolia') }}
    WHERE
        pool_id = 1
),
ffill AS (
    SELECT
        dim.ts,
        dim.pool_id,
        dim.collateral_type,
        dim.token_symbol,
        debt.debt,
        collateral.collateral_value,
        SUM(
            CASE
                WHEN debt.debt IS NOT NULL THEN 1
                ELSE 0
            END
        ) over (
            ORDER BY
                dim.ts
        ) AS debt_id,
        SUM(
            CASE
                WHEN collateral.collateral_value IS NOT NULL THEN 1
                ELSE 0
            END
        ) over (
            ORDER BY
                dim.ts
        ) AS collateral_id
    FROM
        dim
        LEFT JOIN debt
        ON dim.ts = debt.ts
        AND dim.pool_id = debt.pool_id
        AND dim.collateral_type = debt.collateral_type
        LEFT JOIN collateral
        ON dim.ts = collateral.ts
        AND dim.pool_id = collateral.pool_id
        AND dim.collateral_type = collateral.collateral_type
),
hourly_index AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        token_symbol,
        FIRST_VALUE(COALESCE(debt, 0)) over (
            PARTITION BY debt_id,
            pool_id,
            collateral_type,
            token_symbol
            ORDER BY
                ts
        ) AS debt,
        FIRST_VALUE(COALESCE(collateral_value, 0)) over (
            PARTITION BY collateral_id,
            pool_id,
            collateral_type,
            token_symbol
            ORDER BY
                ts
        ) AS collateral_value
    FROM
        ffill
),
hourly_pnl AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        token_symbol,
        collateral_value,
        debt,
        COALESCE(LAG(debt) over (PARTITION BY pool_id, collateral_type
    ORDER BY
        ts) - debt, 0) AS hourly_pnl
    FROM
        hourly_index
),
hourly_rewards AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        token_symbol,
        rewards_usd
    FROM
        {{ ref('fct_pool_rewards_token_hourly_arbitrum_sepolia') }}
),
hourly_returns AS (
    SELECT
        pnl.ts,
        pnl.pool_id,
        pnl.collateral_type,
        pnl.token_symbol,
        pnl.collateral_value,
        COALESCE(
            rewards.rewards_usd,
            0
        ) AS rewards_usd,
        CASE
            WHEN pnl.collateral_value = 0 THEN 0
            ELSE COALESCE(
                rewards.rewards_usd,
                0
            ) / pnl.collateral_value
        END AS hourly_rewards_pct
    FROM
        hourly_pnl pnl
        LEFT JOIN hourly_rewards rewards
        ON pnl.ts = rewards.ts
        AND pnl.pool_id = rewards.pool_id
        AND pnl.collateral_type = rewards.collateral_type
        AND pnl.token_symbol = rewards.token_symbol
),
avg_returns AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        token_symbol,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type,
            token_symbol
            ORDER BY
                ts RANGE BETWEEN INTERVAL '24 HOURS' preceding
                AND CURRENT ROW
        ) AS avg_24h_rewards_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type,
            token_symbol
            ORDER BY
                ts RANGE BETWEEN INTERVAL '7 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_7d_rewards_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY pool_id,
            collateral_type,
            token_symbol
            ORDER BY
                ts RANGE BETWEEN INTERVAL '28 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_28d_rewards_pct
    FROM
        hourly_returns
),
apr_calculations AS (
    SELECT
        hourly_returns.ts,
        hourly_returns.pool_id,
        hourly_returns.collateral_type,
        hourly_returns.token_symbol,
        hourly_returns.collateral_value,
        hourly_returns.rewards_usd,
        hourly_returns.hourly_rewards_pct AS hourly_rewards_pct,
        -- rewards pnls
        avg_returns.avg_24h_rewards_pct * 24 * 365 AS apr_24h_rewards,
        avg_returns.avg_7d_rewards_pct * 24 * 365 AS apr_7d_rewards,
        avg_returns.avg_28d_rewards_pct * 24 * 365 AS apr_28d_rewards
    FROM
        hourly_returns
        JOIN avg_returns
        ON hourly_returns.ts = avg_returns.ts
        AND hourly_returns.pool_id = avg_returns.pool_id
        AND hourly_returns.collateral_type = avg_returns.collateral_type
        AND hourly_returns.token_symbol = avg_returns.token_symbol
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
    token_symbol,
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
