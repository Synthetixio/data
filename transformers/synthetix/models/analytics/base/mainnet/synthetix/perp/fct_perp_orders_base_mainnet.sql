{{ config(
    materialized = "view",
    tags = ["perp", "orders", "base", "mainnet"]
) }}

with base as (
    select
        oc.id as id,
        oc.block_timestamp as ts,
        oc.block_number as block_number,
        oc.transaction_hash as transaction_hash,
        oc.contract as contract,
        oc.market_id as market_id,
        markets.market_symbol as market_symbol,
        CAST(
            oc.account_id as text
        ) as account_id,
        oc.order_type as order_type,
        {{ convert_wei('oc.size_delta') }} as size,
        {{ convert_wei('oc.acceptable_price') }} as acceptable_price,
        oc.settlement_time as settlement_time,
        oc.expiration_time as expiration_time,
        {{ convert_hex('oc.tracking_code') }} as tracking_code,
        oc.sender as sender
    from
        {{ ref('perp_order_committed_base_mainnet') }}
        as oc
    left join {{ ref('fct_perp_markets_base_mainnet') }} as markets
        on oc.market_id = markets.id
)

select
    id,
    ts,
    block_number,
    transaction_hash,
    contract,
    market_id,
    market_symbol,
    account_id,
    order_type,
    size,
    acceptable_price,
    settlement_time,
    expiration_time,
    tracking_code,
    sender
from
    base
