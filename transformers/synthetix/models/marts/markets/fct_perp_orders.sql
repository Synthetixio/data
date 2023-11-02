WITH base as (
    SELECT
        oc.id,
        oc.block_timestamp as ts,
        oc.block_number,
        oc.transaction_hash,
        oc.contract,
        oc.market_id,
        markets.market_symbol,
        oc.account_id,
        oc.order_type,
        {{ convert_wei('oc.size_delta') }} as size,
        {{ convert_wei('oc.acceptable_price') }} as acceptable_price,
        oc.settlement_time,
        oc.expiration_time,
        {{ convert_hex('oc.tracking_code') }} as tracking_code,
        oc.sender
    FROM {{ ref('perp_order_committed') }} oc
    LEFT JOIN {{ ref('fct_perp_markets') }} as markets on oc.market_id=markets.id
)

select * from base
