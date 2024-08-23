{{ config(
    materialized = 'table',
    unique_key = ['ts', 'pool_id', 'collateral_type'],
) }}

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
                {{ ref('fct_pool_debt_eth_mainnet') }}
        ) AS t
        CROSS JOIN (
            SELECT
                DISTINCT pool_id,
                collateral_type
            FROM
                {{ ref('fct_pool_debt_eth_mainnet') }}
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
        {{ ref('fct_pool_issuance_hourly_eth_mainnet') }}
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
        {{ ref('fct_pool_debt_eth_mainnet') }}
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
        {{ ref('core_vault_collateral_eth_mainnet') }}
    WHERE
        pool_id = 1
),
ffill AS (
    SELECT
        dim.ts,
        dim.pool_id,
        dim.collateral_type,
        COALESCE(last(debt) over (PARTITION BY dim.collateral_type, dim.pool_id
    ORDER BY
        dim.ts rows BETWEEN unbounded preceding
        AND CURRENT ROW), 0) AS debt,
        COALESCE(last(collateral_value) over (PARTITION BY dim.collateral_type, dim.pool_id
    ORDER BY
        dim.ts rows BETWEEN unbounded preceding
        AND CURRENT ROW), 0) AS collateral_value
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
hourly_pnl AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        collateral_value,
        debt,
        COALESCE(LAG(debt) over (PARTITION BY pool_id, collateral_type
    ORDER BY
        ts) - debt, 0) AS hourly_pnl
    FROM
        ffill
),
hourly_rewards AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        rewards_usd
    FROM
        {{ ref('fct_pool_rewards_hourly_eth_mainnet') }}
),
hourly_migration AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        hourly_debt_migrated
    FROM
        {{ ref('fct_core_migration_hourly_eth_mainnet') }}
),
hourly_returns AS (
    SELECT
        pnl.ts,
        pnl.pool_id,
        pnl.collateral_type,
        pnl.collateral_value,
        pnl.debt,
        COALESCE(
            iss.hourly_issuance,
            0
        ) hourly_issuance,
        COALESCE(
            migration.hourly_debt_migrated,
            0
        ) AS hourly_debt_migrated,
        pnl.hourly_pnl + COALESCE(
            iss.hourly_issuance,
            0
        ) + COALESCE(
            migration.hourly_debt_migrated,
            0
        ) AS hourly_pnl,
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
            ELSE (COALESCE(iss.hourly_issuance, 0) + pnl.hourly_pnl + COALESCE(migration.hourly_debt_migrated, 0)) / pnl.collateral_value
        END AS hourly_pnl_pct,
        CASE
            WHEN pnl.collateral_value = 0 THEN 0
            ELSE (COALESCE(rewards.rewards_usd, 0) + pnl.hourly_pnl + COALESCE(iss.hourly_issuance, 0) + COALESCE(migration.hourly_debt_migrated, 0)) / pnl.collateral_value
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
        LEFT JOIN hourly_migration migration
        ON pnl.ts = migration.ts
        AND pnl.pool_id = migration.pool_id
        AND LOWER(
            pnl.collateral_type
        ) = LOWER(
            migration.collateral_type
        )
)
SELECT
    ts,
    pool_id,
    collateral_type,
    collateral_value,
    debt,
    hourly_issuance,
    hourly_pnl,
    hourly_debt_migrated,
    rewards_usd,
    hourly_pnl_pct,
    hourly_rewards_pct,
    hourly_total_pct
FROM
    hourly_returns
