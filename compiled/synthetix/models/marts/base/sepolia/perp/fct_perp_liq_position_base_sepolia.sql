WITH liquidations AS (
    SELECT
        id,
        block_timestamp AS ts,
        block_number,
        transaction_hash,
        account_id,
        market_id,
        
    amount_liquidated / 1e18
 AS amount_liquidated,
        
    current_position_size / 1e18
 AS position_size
    FROM
        "analytics"."prod_raw_base_sepolia"."perp_position_liquidated_base_sepolia"
),
markets AS (
    SELECT
        id,
        market_symbol
    FROM
        "analytics"."prod_base_sepolia"."fct_perp_markets_base_sepolia"
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