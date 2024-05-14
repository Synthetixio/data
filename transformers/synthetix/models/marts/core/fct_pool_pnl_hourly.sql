WITH dim AS (
    SELECT
        generate_series(DATE_TRUNC('hour', MIN(t.ts)), DATE_TRUNC('hour', MAX(t.ts)), '1 hour' :: INTERVAL) AS ts,
        p.pool_id,
        p.collateral_type
    FROM
        (
            SELECT
                ts
            FROM
                {{ ref('fct_pool_pnl') }}
        ) AS t
        CROSS JOIN (
            SELECT
                DISTINCT pool_id,
                collateral_type
            FROM
                {{ ref('fct_pool_pnl') }}
        ) AS p
    GROUP BY
        p.pool_id,
        p.collateral_type
),
issuance AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        hourly_issuance
    FROM
        {{ ref('fct_pool_issuance_hourly') }}
),
pnls AS (
    SELECT
        DISTINCT DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        pool_id,
        collateral_type,
        LAST_VALUE(market_pnl) over (PARTITION BY DATE_TRUNC('hour', ts), pool_id, collateral_type
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
        pool_id,
        collateral_type,
        LAST_VALUE(collateral_value) over (PARTITION BY DATE_TRUNC('hour', ts), pool_id, collateral_type
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
        dim.pool_id,
        dim.collateral_type,
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
        AND dim.pool_id = pnls.pool_id
        AND dim.collateral_type = pnls.collateral_type
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
        FIRST_VALUE(COALESCE(pnl, 0)) over (
            PARTITION BY pnl_id,
            pool_id,
            collateral_type
            ORDER BY
                ts
        ) AS pnl,
        FIRST_VALUE(COALESCE(collateral_value, 0)) over (
            PARTITION BY collateral_id,
            pool_id,
            collateral_type
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
        COALESCE(pnl - LAG(pnl) over (PARTITION BY pool_id, collateral_type
    ORDER BY
        ts), 0) AS hourly_pnl,
        collateral_value
    FROM
        hourly_index
),
hourly_rewards AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        rewards_usd
    FROM
        {{ ref('fct_pool_rewards_hourly') }}
),
hourly_returns AS (
    SELECT
        pnl.ts,
        pnl.pool_id,
        pnl.collateral_type,
        pnl.collateral_value,
        COALESCE(
            iss.hourly_issuance,
            0
        ) hourly_issuance,
        SUM(
            COALESCE(
                iss.hourly_issuance,
                0
            )
        ) over (
            PARTITION BY pnl.pool_id,
            pnl.collateral_type
            ORDER BY
                pnl.ts
        ) AS cumulative_issuance,
        pnl.hourly_pnl + COALESCE(
            iss.hourly_issuance,
            0
        ) AS hourly_pnl,
        SUM(
            pnl.hourly_pnl + COALESCE(
                iss.hourly_issuance,
                0
            )
        ) over (
            PARTITION BY pnl.pool_id,
            pnl.collateral_type
            ORDER BY
                pnl.ts
        ) AS cumulative_pnl,
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
            ELSE (COALESCE(iss.hourly_issuance, 0) + pnl.hourly_pnl) / pnl.collateral_value
        END AS hourly_pnl_pct,
        CASE
            WHEN pnl.collateral_value = 0 THEN 0
            ELSE (COALESCE(rewards.rewards_usd, 0) + pnl.hourly_pnl + COALESCE(iss.hourly_issuance, 0)) / pnl.collateral_value
        END AS hourly_total_pct
    FROM
        hourly_pnl pnl
        LEFT JOIN hourly_rewards rewards
        ON pnl.ts = rewards.ts
        AND pnl.pool_id = rewards.pool_id
        AND pnl.collateral_type = rewards.collateral_type
        LEFT JOIN issuance iss
        ON pnl.ts = iss.ts
        AND pnl.pool_id = iss.pool_id
        AND LOWER(
            pnl.collateral_type
        ) = LOWER(
            iss.collateral_type
        )
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
        hourly_returns
)
SELECT
    hourly_returns.ts,
    hourly_returns.pool_id,
    hourly_returns.collateral_type,
    hourly_returns.collateral_value,
    hourly_returns.hourly_issuance,
    hourly_returns.hourly_pnl,
    hourly_returns.cumulative_pnl,
    hourly_returns.cumulative_issuance,
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
    AND hourly_returns.pool_id = avg_returns.pool_id
    AND hourly_returns.collateral_type = avg_returns.collateral_type
