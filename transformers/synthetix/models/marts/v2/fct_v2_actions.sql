{{ config(
    materialized = 'table',
) }}

WITH trade_base AS (

    SELECT
        id,
        block_timestamp,
        transaction_hash,
        last_price,
        account,
        market,
        margin,
        trade_size,
        "size",
        skew,
        fee,
        'trade' AS order_type
    FROM
        {{ ref('v2_perp_position_modified') }}
    WHERE
        trade_size != 0
),
liq_trades AS (
    SELECT
        id,
        block_timestamp,
        transaction_hash,
        last_price,
        account,
        market,
        margin,
        trade_size,
        COALESCE(LAG("size", 1) over (PARTITION BY market, account
    ORDER BY
        id), 0) AS last_size,
        "size",
        skew,
        fee
    FROM
        {{ ref('v2_perp_position_modified') }}
),
liq_base AS (
    SELECT
        id,
        block_timestamp,
        transaction_hash,
        last_price,
        account,
        market,
        margin,
        -1 * last_size AS trade_size,
        "size",
        skew,
        fee,
        'liquidation' AS order_type
    FROM
        liq_trades
    WHERE
        margin = 0
        AND trade_size = 0
        AND "size" = 0
        AND last_size != 0
),
combined_base AS (
    SELECT
        *
    FROM
        (
            SELECT
                *
            FROM
                trade_base
            UNION ALL
            SELECT
                *
            FROM
                liq_base
        ) AS all_base
    ORDER BY
        id
),
all_base AS (
    SELECT
        id,
        block_timestamp AS ts,
        transaction_hash,
        {{ convert_wei('last_price') }} AS price,
        account,
        market,
        {{ convert_wei('margin') }} AS margin,
        {{ convert_wei('trade_size') }} AS trade_size,
        {{ convert_wei('size') }} AS "size",
        {{ convert_wei('skew') }} AS skew,
        {{ convert_wei('fee') }} AS fee,
        order_type,
        COALESCE(LAG({{ convert_wei("size") }}, 1) over (PARTITION BY market, account
    ORDER BY
        id), 0) AS last_size
    FROM
        combined_base
)
SELECT
    *
FROM
    all_base
