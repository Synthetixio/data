{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_ts on {{ this }} (ts)", "create index if not exists idx_market on {{ this }} (market)"]
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
        COALESCE(LAG("size", 1) over (PARTITION BY market, account
    ORDER BY
        id), 0) AS last_size,
        skew,
        fee,
        'trade' AS order_type
    FROM
        {{ ref('v2_perp_position_modified_optimism_mainnet') }}

{% if is_incremental() %}
WHERE
    block_number > (
        SELECT
            COALESCE(MAX(block_number), 0)
        FROM
            {{ this }})
        {% endif %}
    )
SELECT
    trade_base.id,
    block_timestamp AS ts,
    trade_base.block_number,
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
    order_type,
    UPPER(
        COALESCE({{ convert_hex('tracking_code.tracking_code') }}, 'NO TRACKING CODE')) AS tracking_code
        FROM
            trade_base
            LEFT JOIN {{ ref('fct_v2_trade_tracking_optimism_mainnet') }}
            tracking_code
            ON trade_base.id = tracking_code.id
        WHERE
            trade_size != 0
