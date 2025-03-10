if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

QUERY_DEF = """
INSERT INTO {DEST_DB}.{DEST_TABLE}
WITH base AS (
    SELECT
        mu.id AS id,
        mu.block_timestamp AS ts,
        mu.block_number AS block_number,
        mu.transaction_hash AS transaction_hash,
        m.id AS market_id,
        m.market_symbol AS market_symbol,
        mu.price/1e18 AS price,
        mu.skew/1e18 AS skew,
        mu.size/1e18 AS size,
        mu.size_delta/1e18 AS size_delta,
        mu.current_funding_rate/1e18 AS funding_rate,
        mu.current_funding_velocity/1e18 AS funding_velocity,
        mu.interest_rate/1e18 AS interest_rate,
        mu.current_funding_rate/1e18 * 365.25 AS funding_rate_apr,
        mu.current_funding_rate/1e18 * 365.25 + mu.interest_rate/1e18 AS long_rate_apr,
        mu.current_funding_rate/1e18 * -1 * 365.25 + mu.interest_rate/1e18 AS short_rate_apr,
        lagInFrame(mu.size/1e18, 1, 0) OVER (
            PARTITION BY m.market_symbol
            ORDER BY mu.block_timestamp
        ) AS prev_size
    FROM
        {RAW_DATABASE}.perp_market_updated AS mu
    LEFT JOIN (select
        perps_market_id as id,
        block_timestamp as created_ts,
        block_number,
        market_symbol,
        market_name
    from {RAW_DATABASE}.perp_market_created) AS m
        ON mu.market_id = CAST(m.id as UInt64)
    WHERE mu.block_timestamp >= '{MAX_TS}'
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
 market_history as (
    SELECT
        base.id as id,
        base.ts as ts,
        base.block_number as block_number,
        base.transaction_hash as transaction_hash,
        base.market_id as market_id,
        base.market_symbol as market_symbol,
        base.price as price,
        base.skew as skew,
        base.size as size,
        base.size_delta as size_delta,
        base.funding_rate as funding_rate,
        base.funding_velocity as funding_velocity,
        base.interest_rate AS interest_rate,
        base.funding_rate_apr as funding_rate_apr,
        base.long_rate_apr as long_rate_apr,
        base.short_rate_apr as short_rate_apr,
        base.prev_size as prev_size,
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
), all_prices as (
    select
        ts,
        NULL as market_address,
        market_symbol,
        price
    from
        market_history
    union all
    select
        ts,
        collateral_type as market_address,
        NULL as market_symbol,
        collateral_value / amount as price
    from
        {RAW_DATABASE}.core_vault_collateral
    where
        collateral_value > 0 AND 
        ts >= '{MAX_TS}'
),

tokens as (
    select
        token_address,
        token_symbol
    from
        {RAW_DATABASE}.tokens
), 
-- market prices
all_market_prices as (
    select
        p.ts as ts,
        p.market_address as market_address,
        p.price as price,
        COALESCE(
            t.token_symbol,
            p.market_symbol
        ) as market_symbol
    from
        all_prices as p
    left join tokens as t
        on LOWER(
            p.market_address
        ) = LOWER(
            t.token_address
        )
),
-- hourly market prices
market_prices as (
    select distinct
        market_symbol,
        DATE_TRUNC(
            'hour',
            ts
        ) as ts,
        LAST_VALUE(price) over (
            partition by DATE_TRUNC('hour', ts), market_symbol
            order by
                ts
            rows between unbounded preceding
            and unbounded following
        ) as price
    from all_market_prices
),

dim as (
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

ffill as (
    select
        dim.ts as ts,
        dim.market_symbol as market_symbol,
        last_value(market_prices.price) over (
            partition by dim.market_symbol
            order by dim.ts
            rows between unbounded preceding and current row
        ) as price
    from
        dim
    left join market_prices
        on
            dim.ts = market_prices.ts
            and dim.market_symbol = market_prices.market_symbol
),

hourly_prices as (
    select
        ts,
        market_symbol,
        price
    from
        ffill
    order by ts desc, market_symbol
)

select *
from
    hourly_prices
where
    price is not null;

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