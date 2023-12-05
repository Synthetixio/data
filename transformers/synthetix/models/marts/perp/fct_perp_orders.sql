WITH base AS (
    SELECT
        oc.id,
        oc.block_timestamp AS ts,
        oc.block_number,
        oc.transaction_hash,
        oc.contract,
        oc.market_id,
        markets.market_symbol,
        oc.account_id,
        oc.order_type,
        {{ convert_wei('oc.size_delta') }} AS SIZE,
        {{ convert_wei('oc.acceptable_price') }} AS acceptable_price,
        oc.settlement_time,
        oc.expiration_time,
        {{ convert_hex('oc.tracking_code') }} AS tracking_code,
        oc.sender
    FROM
        {{ ref('perp_order_committed') }}
        oc
        LEFT JOIN {{ ref('fct_perp_markets') }} AS markets
        ON oc.market_id = markets.id
)
SELECT
    *
FROM
    base
