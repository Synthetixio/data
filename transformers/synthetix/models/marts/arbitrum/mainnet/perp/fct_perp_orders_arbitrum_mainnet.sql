with arbitrum as (
    select
        oc.id,
        oc.block_timestamp as ts,
        oc.block_number,
        oc.transaction_hash,
        oc.contract,
        oc.market_id,
        markets.market_symbol,
        CAST(
            oc.account_id as text
        ) as account_id,
        oc.order_type,
        {{ convert_wei('oc.size_delta') }} as size,
        {{ convert_wei('oc.acceptable_price') }} as acceptable_price,
        oc.settlement_time,
        oc.expiration_time,
        {{ convert_hex('oc.tracking_code') }} as tracking_code,
        oc.sender
    from
        {{ ref('perp_order_committed_arbitrum_mainnet') }}
        as oc
    left join {{ ref('fct_perp_markets_arbitrum_mainnet') }} as markets
        on oc.market_id = markets.id
)

select *
from
    arbitrum
