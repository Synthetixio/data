WITH all_prices AS (
    SELECT
        ts,
        NULL AS market_address,
        market_symbol,
        price
    FROM
        {{ ref('fct_perp_market_history_base_mainnet') }}
    UNION ALL
    SELECT
        ts,
        NULL AS market_address,
        'SNX' AS market_symbol,
        snx_price AS price
    FROM
        {{ ref('fct_buyback_base_mainnet') }}
    WHERE
        snx_price > 0
    UNION ALL
    SELECT
        ts,
        collateral_type AS market_address,
        NULL AS market_symbol,
        collateral_value / amount AS price
    FROM
        {{ ref('core_vault_collateral_base_mainnet') }}
    WHERE
        collateral_value > 0
),
tokens AS (
    SELECT
        token_address,
        token_symbol
    FROM
        {{ ref('base_mainnet_tokens') }}
)
SELECT
    p.ts,
    p.market_address,
    COALESCE(
        t.token_symbol,
        p.market_symbol
    ) AS market_symbol,
    p.price
FROM
    all_prices p
    LEFT JOIN tokens t
    ON LOWER(
        p.market_address
    ) = LOWER(
        t.token_address
    )
