WITH prices AS (
    SELECT
        DISTINCT DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        market_symbol,
        LAST_VALUE(price) over (PARTITION BY DATE_TRUNC('hour', ts), market_symbol
    ORDER BY
        ts rows BETWEEN unbounded preceding
        AND unbounded following) AS price
    FROM
        {{ ref('fct_prices_arbitrum_sepolia') }}
),
dim AS (
    SELECT
        generate_series(DATE_TRUNC('hour', MIN(t.ts)), DATE_TRUNC('hour', MAX(t.ts)), '1 hour' :: INTERVAL) AS ts,
        m.market_symbol
    FROM
        (
            SELECT
                ts
            FROM
                prices
        ) AS t
        CROSS JOIN (
            SELECT
                DISTINCT market_symbol
            FROM
                prices
        ) AS m
    GROUP BY
        m.market_symbol
),
ffill AS (
    SELECT
        dim.ts,
        dim.market_symbol,
        last(prices.price) over (
            partition by dim.market_symbol 
            order by dim.ts 
            rows between unbounded preceding and current row
        ) as price
    FROM
        dim
        LEFT JOIN prices
        ON dim.ts = prices.ts
        AND dim.market_symbol = prices.market_symbol
),
hourly_prices AS (
    SELECT
        ts,
        market_symbol,
        price
    FROM
        ffill
)
SELECT
    *
FROM
    hourly_prices
WHERE
    price IS NOT NULL
