if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

QUERY_DEF = """
INSERT INTO {DEST_DB}.{DEST_TABLE}
WITH 
time_range AS (
    SELECT
        m.pool_id,
        m.collateral_type,
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
    ) AS m
    GROUP BY
        m.pool_id,
        m.collateral_type
),

-- Generate time series using arrayJoin
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

rewards_distributed_raw AS (
    SELECT
        block_timestamp AS ts,
        CAST(pool_id AS Int32) AS pool_id,
        collateral_type,
        toFloat64(toInt256OrZero(amount)) / 1e18 AS amount,
        distributor,
        toUnixTimestamp(toUInt32(start)) AS ts_start,
        toUInt32(duration) AS duration  -- Ensure duration is a number
    FROM
        {RAW_DATABASE}.core_rewards_distributed
),

distributors AS (
    SELECT
        CAST(distributor_address AS String) AS distributor_address,
        CAST(token_symbol AS String) AS token_symbol
    FROM
        {RAW_DATABASE}.reward_distributors
),

rewards_distributed AS (
    SELECT
        rd.ts,
        rd.pool_id,
        rd.collateral_type,
        rd.distributor,
        distributors.token_symbol,
        rd.amount,
        rd.ts_start,
        rd.duration
    FROM
        rewards_distributed_raw AS rd
    INNER JOIN distributors 
        ON rd.distributor = distributors.distributor_address
    ORDER BY
        ts
),

precalc_rewards AS (
    SELECT
        r.pool_id,
        r.collateral_type,
        r.distributor,
        r.token_symbol,
        r.amount,
        r.ts_start,
        r.duration,
        fromUnixTimestamp(r.ts_start) AS start_time,
        fromUnixTimestamp(r.ts_start) + INTERVAL r.duration SECOND AS end_time
    FROM
        rewards_distributed AS r
),

hourly_distributions AS (
    SELECT
        dim.ts,
        dim.pool_id,
        dim.collateral_type,
        r.distributor,
        r.token_symbol,
        r.amount,
        r.ts_start,
        r.duration,
        row_number() OVER (
            PARTITION BY
                dim.ts,
                dim.pool_id,
                dim.collateral_type,
                r.distributor
            ORDER BY
                r.ts_start DESC
        ) AS distributor_index
    FROM
        dim
    LEFT JOIN precalc_rewards AS r
        ON
            dim.pool_id = r.pool_id
            AND lowerUTF8(dim.collateral_type) = lowerUTF8(r.collateral_type)
    WHERE 
    dim.ts + INTERVAL 1 HOUR >= r.start_time 
    AND dim.ts < r.end_time
),

hourly_rewards AS (
    SELECT
        d.ts as ts,
        d.pool_id as pool_id,
        d.collateral_type as collateral_type,
        d.distributor as distributor,
        d.token_symbol as token_symbol,
        p.prices as price,
        -- get the hourly amount distributed - ensure numeric division
        d.amount / (toFloat64(d.duration) / 3600) AS hourly_amount,
        -- get the amount of time distributed this hour
        -- multiply the result by the hourly amount to get the amount distributed this hour
        (
            least(
                toFloat64(d.duration) / 3600, 
                dateDiff('second', 
                    greatest(d.ts, fromUnixTimestamp(d.ts_start)), 
                    d.ts + INTERVAL 1 HOUR
                ) / 3600.0
            )
        ) * d.amount / (toFloat64(d.duration) / 3600) AS amount_distributed
    FROM
        hourly_distributions AS d
    LEFT JOIN
        analytics_eth.market_prices_hourly AS p
        ON
            d.ts = p.ts
            AND d.token_symbol = p.market_symbol
    WHERE
        d.distributor_index = 1 AND
        d.distributor IS NOT NULL
)

SELECT
    ts,
    pool_id,
    collateral_type,
    sum(amount_distributed * price) as reward_usd
FROM
    hourly_rewards
WHERE
    amount_distributed IS NOT NULL
GROUP BY 1,2,3
"""

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'pool_rewards_hourly'
    DATABASE = kwargs['analytics_db']
    
    client = get_client()
    result = client.query(QUERY_DEF.format(
        DEST_TABLE=TABLE_NAME,
        DEST_DB=kwargs['analytics_db'],
        RAW_DATABASE=kwargs['raw_db'],
        MAX_TS=data['max_ts'][0]
        ))
    
    print(result.result_rows)