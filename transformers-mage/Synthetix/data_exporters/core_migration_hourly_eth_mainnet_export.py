if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

QUERY_DEF = """
INSERT INTO {DEST_DB}.{DEST_TABLE}

WITH 
-- First, get the min and max timestamps
time_range AS (
    SELECT
        m.pool_id as pool_id,
        m.collateral_type as collateral_type,
        toStartOfHour(min(t.ts)) AS min_ts,
        toStartOfHour(max(t.ts)) AS max_ts
    FROM
        (
            SELECT ts
            FROM {RAW_DATABASE}.core_vault_debt
            WHERE ts >= '{MAX_TS}'
        ) AS t
    CROSS JOIN (
        SELECT DISTINCT
            pool_id,
            collateral_type
        FROM
            {RAW_DATABASE}.core_vault_debt
        WHERE ts >= '{MAX_TS}'
    ) AS m
    GROUP BY
        m.pool_id,
        m.collateral_type
),

-- Then create the time series using arrayJoin
dim AS (
    SELECT
        pool_id,
        collateral_type,
        arrayJoin(
            arrayMap(
                x -> dateAdd(hour, x, min_ts),
                range(0, dateDiff('hour', min_ts, max_ts) + 1)
            )
        ) AS ts
    FROM time_range
),

migration AS (
    SELECT
        toStartOfHour(ts) AS ts,
        pool_id,
        collateral_type,
        sum(debt_amount) AS hourly_debt_migrated
    FROM
        (
            SELECT
                block_timestamp as ts,
                block_number,
                transaction_hash,
                1 as pool_id, -- Spartan Council pool
                -- SNX collateral
                '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F' as collateral_type,
                staker,
                account_id,
                collateral_amount/1e18 as collateral_amount,
                debt_amount/1e18 as debt_amount
            FROM eth_mainnet.core_account_migrated
            WHERE ts >= '{MAX_TS}'
        )
    GROUP BY 1,2,3
)

SELECT
    dim.ts,
    dim.pool_id,
    dim.collateral_type,
    coalesce(
        m.hourly_debt_migrated,
        0
    ) AS hourly_debt_migrated
FROM
    dim
LEFT JOIN migration AS m
    ON
        dim.pool_id = m.pool_id
        AND lowerUTF8(dim.collateral_type) = lowerUTF8(m.collateral_type)
        AND dim.ts = m.ts
"""

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'core_migration_hourly'
    DATABASE = kwargs['analytics_db']
    
    client = get_client()
    result = client.query(QUERY_DEF.format(
        DEST_TABLE=TABLE_NAME,
        DEST_DB=kwargs['analytics_db'],
        RAW_DATABASE=kwargs['raw_db'],
        MAX_TS=data['max_ts'][0]
        ))
    
    print(result.result_rows)