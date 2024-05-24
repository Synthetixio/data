{{ config(
    materialized = 'incremental',
    unique_key = 'id',
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
        'trade' AS order_type,
        NULL AS tracking_code
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
    order_type,
    UPPER({{ convert_hex('tracking_code') }}) AS tracking_code
FROM
    trade_base
WHERE
    trade_size != 0
