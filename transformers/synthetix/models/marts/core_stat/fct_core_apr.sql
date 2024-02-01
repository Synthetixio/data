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
debt AS (
    SELECT
        DISTINCT DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        market_id,
        LAST_VALUE(reported_debt) over (PARTITION BY DATE_TRUNC('hour', ts), market_id
    ORDER BY
        ts rows BETWEEN unbounded preceding
        AND unbounded following) AS debt
    FROM
        {{ ref('fct_core_market_updated') }}
    WHERE
        collateral_type != 'USD'
),
ffill AS (
    SELECT
        dim.ts,
        dim.market_id,
        pnls.pnl,
        debt.debt,
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
                WHEN debt.debt IS NOT NULL THEN 1
                ELSE 0
            END
        ) over (
            ORDER BY
                dim.ts
        ) AS debt_id
    FROM
        dim
        LEFT JOIN pnls
        ON dim.ts = pnls.ts
        AND dim.market_id = pnls.market_id
        LEFT JOIN debt
        ON dim.ts = debt.ts
        AND dim.market_id = debt.market_id
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
        FIRST_VALUE(COALESCE(debt, 0)) over (
            PARTITION BY debt_id
            ORDER BY
                ts
        ) AS debt
    FROM
        ffill
),
ranked_pnl AS (
    SELECT
        ts,
        market_id,
        pnl,
        debt,
        LAG(pnl) over (
            PARTITION BY market_id
            ORDER BY
                ts
        ) AS prev_pnl
    FROM
        hourly_pnl
),
hourly_calculations AS (
    SELECT
        ts,
        market_id,
        COALESCE(
            pnl - prev_pnl,
            0
        ) AS hourly_pnl,
        debt,
        (COALESCE(pnl - prev_pnl, 0) / NULLIF(debt, 0)) AS hourly_pnl_pct
    FROM
        ranked_pnl
)
SELECT
    ts,
    market_id,
    hourly_pnl,
    debt,
    hourly_pnl_pct,
    (
        COALESCE(
            EXP(
                SUM(
                    LN(
                        1 + hourly_pnl_pct
                    )
                ) over (
                    PARTITION BY market_id
                    ORDER BY
                        ts rows BETWEEN 23 preceding
                        AND CURRENT ROW
                )
            ) - 1,
            0
        )
    ) AS pnl_pct_24_hr,
    (
        COALESCE(
            (
                EXP(
                    SUM(
                        LN(
                            1 + hourly_pnl_pct
                        )
                    ) over (
                        PARTITION BY market_id
                        ORDER BY
                            ts rows BETWEEN 168 preceding
                            AND CURRENT ROW
                    )
                ) - 1
            ) / 7,
            0
        )
    ) AS pnl_pct_7_day,
    (
        COALESCE(
            EXP(
                SUM(
                    LN(
                        1 + hourly_pnl_pct
                    )
                ) over (
                    PARTITION BY market_id
                    ORDER BY
                        ts rows BETWEEN 23 preceding
                        AND CURRENT ROW
                )
            ) - 1,
            0
        )
    ) * 365 AS apr
FROM
    hourly_calculations
ORDER BY
    market_id,
    ts
