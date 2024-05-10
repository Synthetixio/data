WITH perp_prices AS (
    SELECT
        ts,
        market_symbol,
        price
    FROM
        {{ ref('fct_perp_market_history') }}
),
snx_prices AS (
    SELECT
        ts,
        'SNX' AS market_symbol,
        snx_price AS price
    FROM
        {{ ref('fct_buyback') }}
    WHERE
        snx_price > 0
),
usdc_prices AS (
    SELECT
        ts,
        'USDC' AS market_symbol,
        1 AS price
    FROM
        {{ ref('core_vault_collateral') }}
)
SELECT
    ts,
    market_symbol,
    price
FROM
    perp_prices
UNION ALL
SELECT
    ts,
    market_symbol,
    price
FROM
    snx_prices
UNION ALL
SELECT
    ts,
    market_symbol,
    price
FROM
    usdc_prices
