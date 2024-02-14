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
        {{ ref('fct_perp_pnl') }}
),
collateral AS (
    SELECT
        DISTINCT DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        2 AS market_id,
        LAST_VALUE(amount_delegated) over (PARTITION BY DATE_TRUNC('hour', ts)
    ORDER BY
        ts rows BETWEEN unbounded preceding
        AND unbounded following) AS collateral_value
    FROM
        {{ ref('fct_core_pool_delegation') }}
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
hourly_pnl AS (
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
hourly_calculations AS (
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
        hourly_pnl
),
hourly_returns AS (
    SELECT
        ts,
        market_id,
        collateral_value,
        hourly_pnl,
        hourly_pnl_pct,
        AVG(hourly_pnl_pct) over (
            PARTITION BY market_id
            ORDER BY
                ts RANGE BETWEEN INTERVAL '24 HOURS' preceding
                AND CURRENT ROW
        ) AS avg_24h_pnl_pct,
        AVG(hourly_pnl_pct) over (
            PARTITION BY market_id
            ORDER BY
                ts RANGE BETWEEN INTERVAL '7 DAYS' preceding
                AND CURRENT ROW
        ) AS avg_7d_pnl_pct
    FROM
        hourly_calculations
),
apr_calculations AS (
    SELECT
        ts,
        market_id,
        collateral_value,
        hourly_pnl,
        hourly_pnl_pct,
        avg_24h_pnl_pct,
        avg_7d_pnl_pct,
        avg_24h_pnl_pct * 24 * 365 AS apr_24h,
        avg_7d_pnl_pct * 24 * 365 AS apr_7d
    FROM
        hourly_returns
),
apy_calculations AS (
    SELECT
        *,
        (power(1 + apr_24h / 8760, 8760) - 1) AS apy_24h,
        (power(1 + apr_7d / 8760, 8760) - 1) AS apy_7d
    FROM
        apr_calculations
)
SELECT
    ts,
    market_id,
    collateral_value,
    hourly_pnl,
    hourly_pnl_pct,
    apr_24h,
    apr_7d,
    apy_24h,
    apy_7d
FROM
    apy_calculations
ORDER BY
    market_id,
    ts
