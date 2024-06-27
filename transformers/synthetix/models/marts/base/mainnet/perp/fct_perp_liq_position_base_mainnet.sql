WITH liquidations AS (
    SELECT
        id,
        block_timestamp AS ts,
        block_number,
        transaction_hash,
        account_id,
        market_id,
        {{ convert_wei('amount_liquidated') }} AS amount_liquidated,
        {{ convert_wei('current_position_size') }} AS position_size
    FROM
        {{ ref('perp_position_liquidated_base_mainnet') }}
),
markets AS (
    SELECT
        id,
        market_symbol
    FROM
        {{ ref('fct_perp_markets_base_mainnet') }}
)
SELECT
    l.id,
    l.ts,
    l.block_number,
    l.transaction_hash,
    CAST(
        l.account_id AS text
    ) AS account_id,
    l.market_id,
    m.market_symbol,
    l.amount_liquidated,
    l.position_size
FROM
    liquidations l
    LEFT JOIN markets m
    ON l.market_id = m.id
