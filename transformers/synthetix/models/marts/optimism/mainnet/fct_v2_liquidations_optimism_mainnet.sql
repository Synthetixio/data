{{ config(
    materialized = 'incremental',
    unique_key = 'id',
) }}

WITH liq_trades AS (

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
        {{ ref('v2_perp_position_modified_optimism_mainnet') }}
),
liq_events AS (
    SELECT
        block_number,
        account,
        market,
        transaction_hash,
        total_fee
    FROM
        {{ ref('v2_perp_position_liquidated_optimism_mainnet') }}

{% if is_incremental() %}
WHERE
    block_number > (
        SELECT
            COALESCE(MAX(block_number), 0)
        FROM
            {{ this }})
        {% endif %}
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
            lt.last_size,
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
    )
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
    {{ convert_wei('last_size') }} AS last_size,
    {{ convert_wei('skew') }} AS skew,
    {{ convert_wei('fee') }} AS fee,
    'liquidation' AS order_type,
    NULL AS tracking_code
FROM
    liq_base
