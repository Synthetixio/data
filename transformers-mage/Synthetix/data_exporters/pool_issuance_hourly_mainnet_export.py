if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

QUERY_DEF = """
INSERT INTO {DEST_DB}.{DEST_TABLE}

WITH burns AS (
    SELECT
        block_timestamp AS ts,
        block_number,
        transaction_hash,
        pool_id,
        collateral_type,
        account_id,
        -1 * toInt256OrZero(amount)/1e18 AS amount
    FROM
        {RAW_DATABASE}.core_usd_burned
    ORDER BY
        block_timestamp DESC
),

mints AS (
    SELECT
        block_timestamp AS ts,
        block_number,
        transaction_hash,
        pool_id,
        collateral_type,
        account_id,
        toInt256OrZero(amount)/1e18 AS amount
    FROM
        {RAW_DATABASE}.core_usd_minted
    ORDER BY
        block_timestamp DESC
), 

pool_issuance AS (
    SELECT *
    FROM
        burns
    UNION ALL
    SELECT *
    FROM
        mints
    ORDER BY
        ts DESC
), 

dim AS (
    WITH 
        min_max AS (
            SELECT
                min(toStartOfHour(ts)) AS min_ts,
                max(toStartOfHour(ts)) AS max_ts
            FROM pool_issuance
        ),
        
        pool_collateral_types AS (
            SELECT DISTINCT
                pool_id,
                collateral_type
            FROM pool_issuance
        ),
        
        hourly_series AS (
            SELECT
                p.pool_id,
                p.collateral_type,
                arrayJoin(
                    arrayMap(
                        x -> dateAdd(hour, x, min_ts),
                        range(0, dateDiff('hour', min_ts, max_ts) + 1)
                    )
                ) AS ts
            FROM pool_collateral_types p
            CROSS JOIN min_max
        )

    SELECT
        pool_id,
        collateral_type,
        ts
    FROM hourly_series
    ORDER BY pool_id, collateral_type, ts
),

max_debt_block AS (
    SELECT
        toString(pool_id) AS pool_id,  -- Convert to string to match pool_issuance
        collateral_type,
        date_trunc(
            'hour',
            ts
        ) AS "hour",
        max(block_number) AS max_block_number
    FROM
        {RAW_DATABASE}.core_vault_debt
    GROUP BY
        date_trunc(
            'hour',
            ts
        ),
        pool_id,
        collateral_type
),

filt_issuance AS (
    SELECT
        i.pool_id AS pool_id,
        i.collateral_type AS collateral_type,
        i.amount AS amount,
        CASE
            WHEN
                i.block_number <= d.max_block_number
                OR d.max_block_number IS NULL THEN i.ts
            ELSE i.ts + interval '1 hour'
        END AS ts
    FROM
        pool_issuance
        AS i
    LEFT JOIN max_debt_block AS d
        ON date_trunc(
            'hour',
            i.ts
        ) = d.hour
        AND i.pool_id = d.pool_id
        AND lower(
            i.collateral_type
        ) = lower(
            d.collateral_type
        )
    WHERE
        i.block_number <= (
            SELECT
                max(
                    max_block_number
                ) AS b
            FROM
                max_debt_block
        )
),

issuance AS (
    SELECT
        date_trunc(
            'hour',
            ts
        ) AS ts,
        pool_id,
        collateral_type,
        sum(amount) AS hourly_issuance
    FROM
        filt_issuance
    GROUP BY 1,2,3
    ORDER BY pool_id, collateral_type, ts DESC
)

SELECT
    dim.ts AS ts,
    dim.pool_id AS pool_id,
    dim.collateral_type AS collateral_type,
    coalesce(
        i.hourly_issuance,
        0
    ) AS hourly_issuance
FROM
    dim
LEFT JOIN issuance AS i
    ON
        dim.pool_id = i.pool_id
        AND lower(
            dim.collateral_type
        ) = lower(
            i.collateral_type
        )
        AND dim.ts = i.ts

"""

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'pool_issuance_hourly'
    DATABASE = kwargs['analytics_db']
    
    client = get_client()
    result = client.query(QUERY_DEF.format(
        DEST_TABLE=TABLE_NAME,
        DEST_DB=kwargs['analytics_db'],
        RAW_DATABASE=kwargs['raw_db'],
        MAX_TS=data['max_ts'][0]
        ))
    
    print(result.result_rows)