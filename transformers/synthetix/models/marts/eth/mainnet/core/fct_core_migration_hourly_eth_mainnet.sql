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
                {{ ref('fct_pool_debt_eth_mainnet') }}
        ) AS t
        CROSS JOIN (
            SELECT
                DISTINCT pool_id,
                collateral_type
            FROM
                {{ ref('fct_pool_debt_eth_mainnet') }}
        ) AS m
    GROUP BY
        m.pool_id,
        m.collateral_type
),
max_debt_block AS (
    SELECT
        DATE_TRUNC(
            'hour',
            ts
        ) AS HOUR,
        pool_id,
        collateral_type,
        MAX(block_number) AS max_block_number
    FROM
        {{ ref('fct_pool_debt_eth_mainnet') }}
    GROUP BY
        DATE_TRUNC(
            'hour',
            ts
        ),
        pool_id,
        collateral_type
),
migration AS (
    SELECT
        DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        pool_id,
        collateral_type,
        SUM(debt_amount) AS hourly_debt_migrated
    FROM
        {{ ref('fct_core_migration_eth_mainnet') }}
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
        m.hourly_debt_migrated,
        0
    ) AS hourly_debt_migrated
FROM
    dim
    LEFT JOIN migration m
    ON dim.pool_id = m.pool_id
    AND LOWER(
        dim.collateral_type
    ) = LOWER(
        m.collateral_type
    )
    AND dim.ts = m.ts
