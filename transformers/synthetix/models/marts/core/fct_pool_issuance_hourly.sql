WITH dim AS (
    SELECT
        generate_series(DATE_TRUNC('hour', MIN(t.ts)), DATE_TRUNC('hour', MAX(t.ts)), '1 hour' :: INTERVAL) AS ts,
        m.pool_id,
        m.collateral_type
    FROM
        (
            SELECT
                ts
            FROM
                {{ ref('fct_pool_issuance') }}
        ) AS t
        CROSS JOIN (
            SELECT
                DISTINCT pool_id,
                collateral_type
            FROM
                {{ ref('fct_pool_issuance') }}
        ) AS m
    GROUP BY
        m.pool_id,
        m.collateral_type
),
issuance AS (
    SELECT
        DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        pool_id,
        collateral_type,
        SUM(amount) AS hourly_issuance
    FROM
        {{ ref('fct_pool_issuance') }}
    GROUP BY
        1,
        2,
        3
)
SELECT
    dim.ts,
    dim.pool_id,
    dim.collateral_type,
    COALESCE(
        i.hourly_issuance,
        0
    ) AS hourly_issuance
FROM
    dim
    LEFT JOIN issuance i
    ON dim.pool_id = i.pool_id
    AND LOWER(
        dim.collateral_type
    ) = LOWER(
        i.collateral_type
    )
    AND dim.ts = i.ts
