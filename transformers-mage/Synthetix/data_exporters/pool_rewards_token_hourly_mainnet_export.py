if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

QUERY_DEF = """
INSERT INTO {DEST_DB}.{DEST_TABLE}

WITH rewards_distributed AS (
    SELECT
        block_timestamp AS ts,
        toInt32(pool_id) AS pool_id,
        collateral_type,
        distributor,
        toFloat64(toInt256OrZero(amount)) / 1e18 AS amount,
        toDateTime("start") AS ts_start,
        toInt32("duration") AS duration -- Convert duration to Int32
    FROM
        {RAW_DATABASE}.core_rewards_distributed
),

distributors AS (
    SELECT
        toString(distributor_address) AS distributor_address,
        toString(token_symbol) AS token_symbol
    FROM
        {RAW_DATABASE}.reward_distributors
),

pool_rewards as (
    SELECT
        rd.ts as ts,
        rd.pool_id as pool_id,
        rd.collateral_type as collateral_type,
        rd.distributor as distributor,
        distributors.token_symbol as token_symbol,
        rd.amount as amount,
        rd.ts_start as ts_start,
        rd.duration as duration
    FROM
        rewards_distributed AS rd
    INNER JOIN distributors ON rd.distributor = distributors.distributor_address
    ORDER BY
        rd.ts
),

date_range AS (
    SELECT 
        toStartOfHour(min_ts) AS start_hour,
        toStartOfHour(max_ts) AS end_hour
    FROM 
    (
        SELECT
            MIN(ts_start) AS min_ts,
            MAX(addSeconds(ts_start, toInt32(duration))) AS max_ts -- Ensure duration is Int32
        FROM
            pool_rewards
    )
),
hours AS (
    SELECT 
        arrayJoin(
            arrayMap(
                x -> toDateTime(x), 
                range(
                    toUInt32(toStartOfHour(
                        (SELECT start_hour FROM date_range)
                    )), 
                    toUInt32(toStartOfHour(
                        (SELECT end_hour FROM date_range)
                    )) + 3600, 
                    3600
                )
            )
        ) AS ts
),
distinct_pools AS ( 
    SELECT DISTINCT
        toUInt8(pool_id) as pool_id,
        collateral_type
    FROM
        {RAW_DATABASE}.core_vault_debt
),
dim AS (
    SELECT
        m.pool_id,
        m.collateral_type,
        h.ts
    FROM
        distinct_pools AS m
    CROSS JOIN
        hours AS h
),

token_rewards_distributed as (
    select
        ts,
        pool_id,
        collateral_type,
        distributor,
        token_symbol,
        amount,
        ts_start,
        duration
    from
        pool_rewards
),

dim_normalized AS (
    SELECT
        dim.ts,
        dim.pool_id,
        lower(dim.collateral_type) AS collateral_type_lower,
        dim.collateral_type
    FROM dim
),

rewards_normalized AS (
    SELECT
        r.distributor,
        r.token_symbol,
        r.amount,
        r.ts_start,
        toInt32(r.duration) AS duration, -- Ensure duration is Int32
        r.pool_id,
        lower(r.collateral_type) AS collateral_type_lower
    FROM token_rewards_distributed AS r
    WHERE toInt32(r.duration) > 0
),

-- Create all potential valid combinations
potential_matches AS (
    SELECT
        d.ts,
        d.pool_id,
        d.collateral_type,
        d.collateral_type_lower,
        r.distributor,
        r.token_symbol,
        r.amount,
        r.ts_start,
        r.duration
    FROM dim_normalized AS d
    JOIN rewards_normalized AS r
    ON d.pool_id = r.pool_id AND d.collateral_type_lower = r.collateral_type_lower
),
-- Filter based on time conditions
valid_matches AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        distributor,
        token_symbol,
        amount,
        ts_start,
        duration
    FROM potential_matches
    WHERE ts <= ts_start AND ts < addSeconds(ts_start, duration)
),

hourly_distributions AS (
    SELECT
        v.*,
        -- ClickHouse equivalent to row_number()
        row_number() OVER (
            PARTITION BY v.ts, v.pool_id, v.collateral_type, v.distributor
            ORDER BY v.ts_start DESC
        ) AS distributor_index
    FROM valid_matches AS v
    QUALIFY distributor_index = 1
),

streamed_rewards as (
    SELECT
        d.ts,
        d.pool_id,
        d.collateral_type,
        d.distributor,
        d.token_symbol,
        (
            (
                least(
                    toFloat64(d.duration) / 3600.0,  -- Duration in hours (use decimal division)
                    least(
                        (toUnixTimestamp(addHours(d.ts, 1)) - toUnixTimestamp(greatest(d.ts, d.ts_start))) / 3600.0,
                        (toUnixTimestamp(least(addSeconds(d.ts_start, d.duration), addHours(d.ts, 1))) - toUnixTimestamp(d.ts)) / 3600.0
                    )
                )
            ) * d.amount / (toFloat64(d.duration) / 3600.0)
        ) AS amount
    FROM 
        hourly_distributions AS d
    WHERE 
        d.distributor_index = 1
),

instant_rewards as (
    select
        date_trunc(
            'hour',
            ts
        ) as ts,
        pool_id,
        collateral_type,
        distributor,
        token_symbol,
        amount
    from
        token_rewards_distributed
    where
        toInt32(duration) = 0
),

combined as (
    select
        combo.ts as ts,
        combo.pool_id as pool_id,
        combo.collateral_type as collateral_type,
        combo.distributor as distributor,
        combo.token_symbol as token_symbol,
        combo.amount as amount,
        p.prices as price
    from
        (
            select
                ts,
                pool_id,
                collateral_type,
                distributor,
                token_symbol,
                amount
            from
                streamed_rewards
            union all
            select
                ts,
                pool_id,
                collateral_type,
                distributor,
                token_symbol,
                amount
            from
                instant_rewards
        ) as combo
    left join {ANALYTICS_DB}.market_prices_hourly as p
        on
            combo.token_symbol = p.market_symbol
            and combo.ts = p.ts
),
pool_rewards_token_hourly as (
    SELECT
        ts,
        pool_id,
        collateral_type,
        distributor,
        token_symbol,
        sum(amount * price) AS rewards_usd,
        sum(amount) AS final_amount
    FROM
        combined
    GROUP BY
        ts,
        pool_id,
        collateral_type,
        distributor,
        token_symbol
)
select
    ts,
    pool_id,
    collateral_type,
    distributor,
    token_symbol,
    final_amount as amount,
    rewards_usd
from pool_rewards_token_hourly

"""

@data_exporter
def export_data(data, *args, **kwargs):

    if kwargs['raw_db'] in ['eth_mainnet']:
        return {}
        
    TABLE_NAME = 'token_rewards_hourly'
    DATABASE = kwargs['analytics_db']
    
    client = get_client()
    result = client.query(QUERY_DEF.format(
        DEST_TABLE=TABLE_NAME,
        DEST_DB=kwargs['analytics_db'],
        ANALYTICS_DB=kwargs['analytics_db'],
        RAW_DATABASE=kwargs['raw_db'],
        MAX_TS=data['max_ts'][0]
        ))
    
    print(result.result_rows)