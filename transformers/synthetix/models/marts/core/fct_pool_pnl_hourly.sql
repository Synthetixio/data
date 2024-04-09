WITH dim AS (
    SELECT
        generate_series(DATE_TRUNC('hour', MIN(t.ts)), DATE_TRUNC('hour', MAX(t.ts)), '1 hour' :: INTERVAL) AS ts,
        m.market_id
    FROM
        (
            SELECT
                ts
            FROM
                {{ ref('fct_core_market_updated') }}
        ) AS t
        CROSS JOIN (
            SELECT
                DISTINCT market_id
            FROM
                {{ ref('fct_core_market_updated') }}
        ) AS m
    GROUP BY
        m.market_id
),
pnls AS (
    SELECT
        DISTINCT DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        market_id,
        LAST_VALUE(market_pnl) over (PARTITION BY DATE_TRUNC('hour', ts), market_id
    ORDER BY
        ts rows BETWEEN unbounded preceding
        AND unbounded following) AS pnl
    FROM
        {{ ref('fct_pool_pnl') }}
),
collateral AS (
    SELECT
        DISTINCT DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        2 AS market_id,
        LAST_VALUE(collateral_value) over (PARTITION BY DATE_TRUNC('hour', ts)
    ORDER BY
        ts rows BETWEEN unbounded preceding
        AND unbounded following) AS collateral_value
    FROM
        {{ ref('core_vault_collateral') }}
    WHERE
        pool_id = 1
),
ffill AS (
    SELECT
        dim.ts,
        dim.market_id,
        pnls.pnl,
        collateral.collateral_value,
        SUM(
            CASE
                WHEN pnls.pnl IS NOT NULL THEN 1
                ELSE 0
            END
        ) over (
            ORDER BY
                dim.ts
        ) AS pnl_id,
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
        LEFT JOIN pnls
        ON dim.ts = pnls.ts
        AND dim.market_id = pnls.market_id
        LEFT JOIN collateral
        ON dim.ts = collateral.ts
        AND dim.market_id = collateral.market_id
),
hourly_index AS (
    SELECT
        ts,
        market_id,
        FIRST_VALUE(COALESCE(pnl, 0)) over (
            PARTITION BY pnl_id,
            market_id
            ORDER BY
                ts
        ) AS pnl,
        FIRST_VALUE(COALESCE(collateral_value, 0)) over (
            PARTITION BY collateral_id,
            market_id
            ORDER BY
                ts
        ) AS collateral_value
    FROM
        ffill
),
hourly_pnl AS (
    SELECT
        ts,
        market_id,
        COALESCE(pnl - LAG(pnl) over (PARTITION BY market_id
    ORDER BY
        ts), 0) AS hourly_pnl,
        collateral_value,
        COALESCE(
            (pnl - LAG(pnl) over (PARTITION BY market_id
            ORDER BY
                ts)) / NULLIF(
                    collateral_value,
                    0
                ),
                0
        ) AS hourly_pnl_pct
    FROM
        hourly_index
),
hourly_rewards AS (
    SELECT
        ts,
        market_id,
        pool_id,
        collateral_type,
        rewards_usd
    FROM
        {{ ref('fct_pool_rewards_hourly') }}
),
hourly_returns AS (
    SELECT
        pnl.ts,
        pnl.market_id,
        pnl.collateral_value,
        pnl.hourly_pnl,
        pnl.hourly_pnl_pct,
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
        END AS hourly_rewards_pct,
        CASE
            WHEN pnl.collateral_value = 0 THEN 0
            ELSE (COALESCE(rewards.rewards_usd, 0) + pnl.hourly_pnl) / pnl.collateral_value
        END AS hourly_total_pct
    FROM
        hourly_pnl pnl
        LEFT JOIN hourly_rewards rewards
        ON pnl.ts = rewards.ts
        AND pnl.market_id = rewards.market_id
),
avg_returns AS (
    SELECT
        ts,
        market_id,
        AVG(
            hourly_pnl_pct
        ) over (
            PARTITION BY market_id
            ORDER BY
                ts RANGE BETWEEN INTERVAL '24 HOURS' preceding
                AND CURRENT ROW
        ) AS avg_24h_pnl_pct,
        AVG(
            hourly_pnl_pct
        ) over (
            PARTITION BY market_id
            ORDER BY
                ts RANGE BETWEEN INTERVAL '7 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_7d_pnl_pct,
        AVG(
            hourly_pnl_pct
        ) over (
            PARTITION BY market_id
            ORDER BY
                ts RANGE BETWEEN INTERVAL '28 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_28d_pnl_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY market_id
            ORDER BY
                ts RANGE BETWEEN INTERVAL '24 HOURS' preceding
                AND CURRENT ROW
        ) AS avg_24h_rewards_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY market_id
            ORDER BY
                ts RANGE BETWEEN INTERVAL '7 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_7d_rewards_pct,
        AVG(
            hourly_rewards_pct
        ) over (
            PARTITION BY market_id
            ORDER BY
                ts RANGE BETWEEN INTERVAL '28 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_28d_rewards_pct,
        AVG(
            hourly_total_pct
        ) over (
            PARTITION BY market_id
            ORDER BY
                ts RANGE BETWEEN INTERVAL '24 HOURS' preceding
                AND CURRENT ROW
        ) AS avg_24h_total_pct,
        AVG(
            hourly_total_pct
        ) over (
            PARTITION BY market_id
            ORDER BY
                ts RANGE BETWEEN INTERVAL '7 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_7d_total_pct,
        AVG(
            hourly_total_pct
        ) over (
            PARTITION BY market_id
            ORDER BY
                ts RANGE BETWEEN INTERVAL '28 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_28d_total_pct
    FROM
        hourly_returns
)
SELECT
    hourly_returns.ts,
    hourly_returns.market_id,
    hourly_returns.collateral_value,
    hourly_returns.hourly_pnl,
    hourly_returns.rewards_usd,
    hourly_returns.hourly_pnl_pct,
    hourly_returns.hourly_rewards_pct,
    hourly_returns.hourly_total_pct,
    avg_returns.avg_24h_pnl_pct,
    avg_returns.avg_24h_rewards_pct,
    avg_returns.avg_24h_total_pct,
    avg_returns.avg_7d_pnl_pct,
    avg_returns.avg_7d_rewards_pct,
    avg_returns.avg_7d_total_pct,
    avg_returns.avg_28d_pnl_pct,
    avg_returns.avg_28d_rewards_pct,
    avg_returns.avg_28d_total_pct
FROM
    hourly_returns
    JOIN avg_returns
    ON hourly_returns.ts = avg_returns.ts
    AND hourly_returns.market_id = avg_returns.market_id
