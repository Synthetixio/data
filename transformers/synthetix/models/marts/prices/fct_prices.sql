WITH all_prices AS (
    {% if target.name in (
            'base_mainnet',
            'base_sepolia'
        ) %}
    SELECT
        ts,
        NULL AS market_address,
        market_symbol,
        price
    FROM
        {{ ref('fct_perp_market_history') }}
    UNION ALL
    SELECT
        ts,
        NULL AS market_address,
        'SNX' AS market_symbol,
        snx_price AS price
    FROM
        {{ ref('fct_buyback') }}
    WHERE
        snx_price > 0
    UNION ALL
    {% endif %}
    SELECT
        ts,
        collateral_type AS market_address,
        NULL AS market_symbol,
        amount / collateral_value AS price
    FROM
        {{ ref('core_vault_collateral') }}
    WHERE
        collateral_value > 0
),
tokens AS (
    SELECT
        token_address,
        token_symbol
    FROM
        {{ ref(
            target.name ~ '_tokens'
        ) }}
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
