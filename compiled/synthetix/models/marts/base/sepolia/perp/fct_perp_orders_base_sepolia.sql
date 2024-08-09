WITH base AS (
    SELECT
        oc.id,
        oc.block_timestamp AS ts,
        oc.block_number,
        oc.transaction_hash,
        oc.contract,
        oc.market_id,
        markets.market_symbol,
        CAST(
            oc.account_id AS text
        ) AS account_id,
        oc.order_type,
        
    oc.size_delta / 1e18
 AS SIZE,
        
    oc.acceptable_price / 1e18
 AS acceptable_price,
        oc.settlement_time,
        oc.expiration_time,
        
    LEFT(
        REGEXP_REPLACE(
            encode(
                DECODE(REPLACE(oc.tracking_code, '0x', ''), 'hex'),
                'escape'
            ) :: text,
            '\\000',
            '',
            'g'
        ),
        20
    )
 AS tracking_code,
        oc.sender
    FROM
        "analytics"."prod_raw_base_sepolia"."perp_order_committed_base_sepolia"
        oc
        LEFT JOIN "analytics"."prod_base_sepolia"."fct_perp_markets_base_sepolia" AS markets
        ON oc.market_id = markets.id
)
SELECT
    *
FROM
    base