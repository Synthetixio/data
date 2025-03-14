if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

QUERY_DEF = """
INSERT INTO {DEST_DB}.{DEST_TABLE}

WITH 
time_range AS (
    SELECT
        p.pool_id,
        p.collateral_type,
        toStartOfHour(min(t.ts)) AS min_ts,
        toStartOfHour(max(t.ts)) AS max_ts
    FROM
        (
            SELECT ts
            FROM {RAW_DATABASE}.core_vault_debt
        ) AS t
    CROSS JOIN (
        SELECT DISTINCT
            pool_id,
            collateral_type
        FROM
            {RAW_DATABASE}.core_vault_debt
    ) AS p
    GROUP BY
        p.pool_id,
        p.collateral_type
),

dim AS (
    SELECT
        arrayJoin(
            arrayMap(
                x -> dateAdd(hour, x, min_ts),
                range(0, dateDiff('hour', min_ts, max_ts) + 1)
            )
        ) AS ts,
        pool_id,
        collateral_type
    FROM time_range
),

issuance AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        hourly_issuance
    FROM
        {ANALYTICS_DB}.pool_issuance_hourly
),

debt AS (
    SELECT DISTINCT
        pool_id,
        collateral_type,
        toStartOfHour(ts) AS ts,
        last_value(debt) OVER (
            PARTITION BY toStartOfHour(ts), pool_id, collateral_type
            ORDER BY ts
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS debt
    FROM
        {RAW_DATABASE}.core_vault_debt
),

collateral AS (
    SELECT DISTINCT
        pool_id,
        collateral_type,
        toStartOfHour(ts) AS ts,
        last_value(collateral_value) OVER (
            PARTITION BY toStartOfHour(ts), pool_id, collateral_type
            ORDER BY ts
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS collateral_value
    FROM
        {RAW_DATABASE}.core_vault_collateral
    WHERE
        pool_id = 1
),

ffill AS (
    SELECT
        dim.ts as ts,
        dim.pool_id as pool_id,
        dim.collateral_type as collateral_type,
        coalesce(
            last_value(debt.debt) OVER (
                PARTITION BY dim.collateral_type, dim.pool_id
                ORDER BY dim.ts
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ),
            0
        ) AS debt,
        coalesce(
            last_value(collateral.collateral_value) OVER (
                PARTITION BY dim.collateral_type, dim.pool_id
                ORDER BY dim.ts
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ),
            0
        ) AS collateral_value
    FROM
        dim
    LEFT JOIN debt
        ON
            dim.ts = debt.ts
            AND dim.pool_id = debt.pool_id
            AND dim.collateral_type = debt.collateral_type
    LEFT JOIN collateral
        ON
            dim.ts = collateral.ts
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
        coalesce(lagInFrame(debt) OVER (
            PARTITION BY pool_id, collateral_type
            ORDER BY ts
        ) - debt, 0) AS hourly_pnl
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
        {ANALYTICS_DB}.pool_rewards_hourly
),

hourly_migration AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        hourly_debt_migrated
    FROM
        {ANALYTICS_DB}.core_migration_hourly
),

hourly_returns AS (
    SELECT
        pnl.ts as ts,
        pnl.pool_id as pool_id,
        pnl.collateral_type as collateral_type,
        pnl.collateral_value as collateral_value,
        pnl.debt as debt,
        coalesce(
            iss.hourly_issuance,
            0
        ) AS hourly_issuance,
        coalesce(
            migration.hourly_debt_migrated,
            0
        ) AS hourly_debt_migrated,
        pnl.hourly_pnl + coalesce(
            iss.hourly_issuance,
            0
        ) + coalesce(
            migration.hourly_debt_migrated,
            0
        ) AS hourly_pnl,
        coalesce(
            rewards.rewards_usd,
            0
        ) AS rewards_usd,
        CASE
            WHEN pnl.collateral_value = 0 THEN 0
            ELSE coalesce(
                rewards.rewards_usd,
                0
            ) / pnl.collateral_value
        END AS hourly_rewards_pct,
        CASE
            WHEN pnl.collateral_value = 0 THEN 0
            ELSE (
                coalesce(iss.hourly_issuance, 0)
                + pnl.hourly_pnl
                + coalesce(migration.hourly_debt_migrated, 0)
            ) / pnl.collateral_value
        END AS hourly_pnl_pct,
        CASE
            WHEN pnl.collateral_value = 0 THEN 0
            ELSE (
                coalesce(rewards.rewards_usd, 0)
                + pnl.hourly_pnl
                + coalesce(iss.hourly_issuance, 0)
                + coalesce(migration.hourly_debt_migrated, 0)
            ) / pnl.collateral_value
        END AS hourly_total_pct
    FROM
        hourly_pnl AS pnl
    LEFT JOIN hourly_rewards AS rewards
        ON
            pnl.ts = rewards.ts
            AND pnl.pool_id = rewards.pool_id
            AND pnl.collateral_type = rewards.collateral_type
    LEFT JOIN issuance AS iss
        ON
            pnl.ts = iss.ts
            AND pnl.pool_id = iss.pool_id
            AND lowerUTF8(pnl.collateral_type) = lowerUTF8(iss.collateral_type)
    LEFT JOIN hourly_migration AS migration
        ON
            pnl.ts = migration.ts
            AND pnl.pool_id = migration.pool_id
            AND lowerUTF8(pnl.collateral_type) = lowerUTF8(migration.collateral_type)
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
"""

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'pnl_hourly'
    DATABASE = kwargs['analytics_db']
    
    client = get_client()
    
    result = client.query(QUERY_DEF.format(
        DEST_TABLE=TABLE_NAME,
        DEST_DB=kwargs['analytics_db'],
        RAW_DATABASE=kwargs['raw_db'],
        ANALYTICS_DB=kwargs['analytics_db'],
        MAX_TS=data['max_ts'][0]
        ))
    
    print(result.result_rows)