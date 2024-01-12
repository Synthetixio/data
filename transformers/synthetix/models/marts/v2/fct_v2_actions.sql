{{ config(
    materialized = 'table',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_ts on {{ this }} (ts)", "create index if not exists idx_market on {{ this }} (market)", "create index if not exists idx_account on {{ this }} (account)" ]
) }}

WITH trade_base AS (

    SELECT
        id,
        block_timestamp,
        block_number,
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
        block_number,
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
liq_events AS (
    SELECT
        block_number,
        account,
        market,
        transaction_hash,
        total_fee
    FROM
        {{ ref('v2_perp_position_liquidated') }}
),
liq_base AS (
    SELECT
        liq_trades.id,
        liq_trades.block_timestamp,
        liq_trades.block_number,
        liq_trades.transaction_hash,
        liq_trades.last_price,
        liq_trades.account,
        liq_trades.market,
        liq_trades.margin,
        -1 * liq_trades.last_size AS trade_size,
        liq_trades.size,
        liq_trades.skew,
        liq_trades.fee + liq_events.total_fee AS fee,
        'liquidation' AS order_type
    FROM
        liq_trades
        JOIN liq_events USING (
            block_number,
            account,
            market,
            transaction_hash
        )
    WHERE
        liq_trades.margin = 0
        AND liq_trades.trade_size = 0
        AND liq_trades.size = 0
        AND liq_trades.last_size != 0
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
        block_number,
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
