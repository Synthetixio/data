if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

QUERY_DEF = """
INSERT INTO {DEST_DB}.{DEST_TABLE}

WITH all_prices AS (
    SELECT
        ts,
        collateral_type AS market_address,
        NULL AS market_symbol,
        collateral_value / amount AS price
    FROM
        eth_mainnet.core_vault_collateral
    WHERE
        collateral_value > 0
), 

tokens AS (
    SELECT
        token_address,
        token_symbol
    FROM 
        eth_mainnet.tokens
),

market_prices AS (
    SELECT
        p.ts,
        p.market_address,
        p.price,
        COALESCE(t.token_symbol, p.market_symbol) AS market_symbol
    FROM
        all_prices AS p
    LEFT JOIN tokens AS t
        ON lowerUTF8(p.market_address) = lowerUTF8(t.token_address)
), 

prices AS (
    SELECT DISTINCT
        market_symbol,
        toStartOfHour(ts) AS ts,
        last_value(price) OVER (
            PARTITION BY toStartOfHour(ts), market_symbol
            ORDER BY ts
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) AS price
    FROM
        market_prices
),

-- Get min and max timestamps for time series generation
time_range AS (
    SELECT
        m.market_symbol as market_symbol,
        toStartOfHour(MIN(t.ts)) AS min_ts,
        toStartOfHour(MAX(t.ts)) AS max_ts
    FROM
        (SELECT ts FROM prices) AS t
    CROSS JOIN 
        (SELECT DISTINCT market_symbol FROM prices) AS m
    GROUP BY
        m.market_symbol
),

-- Generate time series using arrayJoin
dim AS (
    SELECT
        market_symbol,
        arrayJoin(
            arrayMap(
                x -> dateAdd(hour, x, min_ts),
                range(0, dateDiff('hour', min_ts, max_ts) + 1)
            )
        ) AS ts
    FROM time_range
),

ffill AS (
    SELECT
        dim.ts as ts,
        dim.market_symbol as market_symbol,
        last_value(prices.price) OVER (
            PARTITION BY dim.market_symbol
            ORDER BY dim.ts
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS price
    FROM
        dim
    LEFT JOIN prices
        ON dim.ts = prices.ts AND dim.market_symbol = prices.market_symbol
    where price is not NULL
)

select * from ffill order by ts
"""

@data_exporter
def export_data(data, *args, **kwargs):
    
    TABLE_NAME = 'market_prices_hourly'
    DATABASE = kwargs['analytics_db']
    
    client = get_client()
    result = client.query(QUERY_DEF.format(
        DEST_TABLE=TABLE_NAME,
        DEST_DB=kwargs['analytics_db'],
        RAW_DATABASE=kwargs['raw_db'],
        MAX_TS=data['max_ts'][0]
        ))
    
    print(result.result_rows)