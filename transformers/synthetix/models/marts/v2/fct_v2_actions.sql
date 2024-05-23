{{ config(
    materialized = 'incremental',
    unique_key = 'id',
) }}

WITH latest_tracking_code AS (

    SELECT
        account,
        market,
        MAX(block_number) AS max_block_number
    FROM
        {{ ref('v2_perp_delayed_order_submitted') }}
    GROUP BY
        account,
        market
),
trade_tracking AS (
    SELECT
        tc.block_number,
        tc.account,
        tc.market,
        tc.tracking_code,
        ltc.max_block_number
    FROM
        optimism_mainnet.v2_perp_delayed_order_submitted tc
        JOIN latest_tracking_code ltc
        ON tc.account = ltc.account
        AND tc.market = ltc.market
        AND tc.block_number = ltc.max_block_number
),
trade_base AS (
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

{% if is_incremental() %}
AND block_number > (
    SELECT
        COALESCE(MAX(block_number), 0)
    FROM
        {{ this }})
    {% endif %}
),
trade_with_tracking AS (
    SELECT
        tb.*,
        tc.tracking_code
    FROM
        trade_base tb
        LEFT JOIN trade_tracking tc
        ON tb.account = tc.account
        AND tb.market = tc.market
        AND tb.block_number >= tc.max_block_number
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

{% if is_incremental() %}
WHERE
    block_number > (
        SELECT
            COALESCE(MAX(block_number), 0)
        FROM
            {{ this }})
        {% endif %}
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
            lt.id,
            lt.block_timestamp,
            lt.block_number,
            lt.transaction_hash,
            lt.last_price,
            lt.account,
            lt.market,
            lt.margin,
            -1 * lt.last_size AS trade_size,
            lt.size,
            lt.skew,
            lt.fee + le.total_fee AS fee,
            'liquidation' AS order_type,
            NULL AS tracking_code
        FROM
            liq_trades lt
            JOIN liq_events le
            ON lt.block_number = le.block_number
            AND lt.account = le.account
            AND lt.market = le.market
            AND lt.transaction_hash = le.transaction_hash
        WHERE
            lt.margin = 0
            AND lt.trade_size = 0
            AND lt.size = 0
            AND lt.last_size != 0
    ),
    combined_base AS (
        SELECT
            *
        FROM
            trade_with_tracking
        UNION ALL
        SELECT
            *
        FROM
            liq_base
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
            id), 0) AS last_size,
            UPPER({{ convert_hex('tracking_code') }}) AS tracking_code
        FROM
            combined_base)
        SELECT
            *
        FROM
            all_base
        ORDER BY
            id
