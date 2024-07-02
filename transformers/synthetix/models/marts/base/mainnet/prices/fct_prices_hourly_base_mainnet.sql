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
        {{ ref('fct_prices_base_mainnet') }}
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
        prices.price,
        SUM(
            CASE
                WHEN prices.price IS NOT NULL THEN 1
                ELSE 0
            END
        ) over (
            PARTITION BY dim.market_symbol
            ORDER BY
                dim.ts
        ) AS price_id
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
        FIRST_VALUE(price) over (
            PARTITION BY price_id,
            market_symbol
            ORDER BY
                ts
        ) AS price
    FROM
        ffill
)
SELECT
    *
FROM
    hourly_prices
WHERE
    price IS NOT NULL
