if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client


@data_exporter
def export_data(data, *args, **kwargs):

    if kwargs['raw_db'] in ['eth_mainnet']:
        return {}

    TABLE_NAME = 'market_prices_hourly'
    DATABASE = kwargs['analytics_db']
    
    # Fix: These were standalone variables without assignment
    DEST_TABLE = TABLE_NAME
    DEST_DB = kwargs['analytics_db']
    RAW_DATABASE = kwargs['raw_db']
    MAX_TS = data['max_ts'][0]

    BUYBACK_STMT1 = f"""
    buyback as (
    SELECT 
        id,
        block_timestamp as ts,
        buyer,
        cast(snx as Int256)/1e18 as snx,
        cast(snx as Int256)/1e18 as usd,
        (cast(usd as Int256)/1e18)/(cast(snx as Int256)/1e18) as snx_price
    FROM {RAW_DATABASE}.buyback_processed
    ),
    """

    BUYBACK_STMT2 = f"""
    union all
    select
        ts,
        null as market_address,
        'SNX' as market_symbol,
        snx_price as price
    from
        buyback
    where
        snx_price > 0
    """

    QUERY_DEF = f"""
INSERT INTO {DEST_DB}.{DEST_TABLE}

WITH base AS (

SELECT
    mu.id AS id,
    mu.block_timestamp AS ts,
    mu.block_number AS block_number,
    mu.transaction_hash AS transaction_hash,
    mu.market_id AS market_id,
    m.market_symbol AS market_symbol,
    cast(mu.price as Int256)/1e18 AS price,
    cast(mu.skew as Int256)/1e18 AS skew,
    cast(mu.size as Int256)/1e18 AS size,
    cast(mu.size_delta as Int256)/1e18 AS size_delta,
    cast(mu.current_funding_rate as Int256)/1e18 AS funding_rate,
    cast(mu.current_funding_velocity as Int256)/1e18 AS funding_velocity,
    cast(mu.interest_rate as Int256)/1e18 AS interest_rate,
    cast(mu.current_funding_rate as Int256)/1e18 * 365.25 AS funding_rate_apr,
    cast(mu.current_funding_rate as Int256)/1e18 * 365.25 + cast(mu.interest_rate as Int256)/1e18 AS long_rate_apr,
    cast(mu.current_funding_rate as Int256)/1e18 * -1.0 * 365.25 + cast(mu.interest_rate as Int256)/1e18 AS short_rate_apr,
    lagInFrame(cast(mu.size as Int256)/1e18, 1, 0) OVER (
        PARTITION BY m.market_symbol
        ORDER BY mu.block_timestamp
    ) AS prev_size
FROM
    {RAW_DATABASE}.perp_market_updated AS mu
LEFT JOIN (
    SELECT
        toString(perps_market_id) AS id,  -- Convert to String to match mu.market_id
        block_timestamp AS created_ts,
        block_number,
        market_symbol,
        market_name
    FROM {RAW_DATABASE}.perp_market_created
) AS m
ON mu.market_id = m.id
),

-- open interest
oi AS (
    SELECT
        id,
        ts,
        market_symbol,
        size * price AS market_oi_usd,
        lagInFrame(
            size * price,
            1,
            0
        ) OVER (
            PARTITION BY market_symbol
            ORDER BY ts ASC
        ) AS prev_market_oi_usd,
        (size + skew) * price / 2 AS long_oi,
        (size - skew) * price / 2 AS short_oi,
        CASE
            WHEN size * price = 0 THEN NULL
            ELSE ((size + skew) * price / 2) / (size * price)
        END AS long_oi_pct,
        CASE
            WHEN size * price = 0 THEN NULL
            ELSE ((size - skew) * price / 2) / (size * price)
        END AS short_oi_pct
    FROM
        base
),

total_oi AS (
    SELECT
        id,
        SUM(
            market_oi_usd - prev_market_oi_usd
        ) OVER (
            ORDER BY ts ASC
        ) AS total_oi_usd
    FROM
        oi
),

-- market history
market_history AS (
    SELECT
        base.id AS id,
        base.ts AS ts,
        base.block_number AS block_number,
        base.transaction_hash AS transaction_hash,
        base.market_id AS market_id,
        base.market_symbol AS market_symbol,
        base.price AS price,
        base.skew AS skew,
        base.size AS size,
        base.size_delta AS size_delta,
        base.funding_rate AS funding_rate,
        base.funding_velocity AS funding_velocity,
        base.interest_rate AS interest_rate,
        base.funding_rate_apr AS funding_rate_apr,
        base.long_rate_apr AS long_rate_apr,
        base.short_rate_apr AS short_rate_apr,
        base.prev_size AS prev_size,
        ROUND(oi.market_oi_usd, 2) AS market_oi_usd,
        ROUND(total_oi.total_oi_usd, 2) AS total_oi_usd,
        ROUND(oi.long_oi, 2) AS long_oi,
        ROUND(oi.short_oi, 2) AS short_oi,
        oi.long_oi_pct,
        oi.short_oi_pct
    FROM
        base
    INNER JOIN oi
        ON base.id = oi.id
    INNER JOIN total_oi
        ON base.id = total_oi.id
),

{BUYBACK_STMT1 if DATABASE == 'base_mainnet' else ''}

all_prices AS (
    SELECT
        ts,
        NULL AS market_address,
        market_symbol,
        price
    FROM
        market_history
    {BUYBACK_STMT2 if DATABASE == 'base_mainnet' else ''}
    UNION ALL
    SELECT
        ts,
        collateral_type AS market_address,
        NULL AS market_symbol,
        collateral_value / amount AS price  -- These are already divided by 1e18
    FROM
        {RAW_DATABASE}.core_vault_collateral
    WHERE
        collateral_value > 0
),

tokens AS (
    SELECT
        token_address,
        token_symbol
    FROM
        {RAW_DATABASE}.tokens
),

-- market prices
all_market_prices AS (
    SELECT
        p.ts AS ts,
        p.market_address AS market_address,
        p.price AS price,
        COALESCE(
            t.token_symbol,
            p.market_symbol
        ) AS market_symbol
    FROM
        all_prices AS p
    LEFT JOIN tokens AS t
        ON LOWER(
            p.market_address
        ) = LOWER(
            t.token_address
        )
),

-- hourly market prices
market_prices AS (
    SELECT DISTINCT
        market_symbol,
        DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        LAST_VALUE(price) OVER (
            PARTITION BY DATE_TRUNC('hour', ts), market_symbol
            ORDER BY
                ts
            ROWS BETWEEN UNBOUNDED PRECEDING
            AND UNBOUNDED FOLLOWING
        ) AS price
    FROM all_market_prices
),

dim AS (
    WITH 
        min_max AS (
            SELECT
                market_symbol,
                toStartOfHour(min(ts)) AS min_ts,
                toStartOfHour(max(ts)) AS max_ts
            FROM market_prices
            GROUP BY market_symbol
        ),
        
        market_symbols AS (
            SELECT DISTINCT market_symbol
            FROM market_prices
        ),
        
        hourly_series AS (
            SELECT
                market_symbol,
                arrayJoin(
                    arrayMap(
                        x -> dateAdd(hour, x, min_ts),
                        range(0, dateDiff('hour', min_ts, max_ts) + 1)
                    )
                ) AS ts
            FROM min_max
        )

    SELECT
        market_symbol,
        ts
    FROM hourly_series
    ORDER BY market_symbol, ts
),

ffill AS (
    SELECT
        dim.ts AS ts,
        dim.market_symbol AS market_symbol,
        last_value(market_prices.price) OVER (
            PARTITION BY dim.market_symbol
            ORDER BY dim.ts
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS price
    FROM
        dim
    LEFT JOIN market_prices
        ON
            dim.ts = market_prices.ts
            AND dim.market_symbol = market_prices.market_symbol
),

hourly_prices AS (
    SELECT
        ts,
        market_symbol,
        price
    FROM
        ffill
    ORDER BY ts DESC, market_symbol
)

SELECT *
FROM
    hourly_prices
WHERE
    price IS NOT NULL
    """
    
    client = get_client()
    result = client.query(QUERY_DEF)
    
    print(result.result_rows)