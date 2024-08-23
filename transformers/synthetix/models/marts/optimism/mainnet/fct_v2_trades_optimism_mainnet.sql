{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_ts on {{ this }} (ts)", "create index if not exists idx_market on {{ this }} (market)"]
) }}

with trade_base as (

    select
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
        'trade' as order_type,
        COALESCE(LAG("size", 1) over (
            partition by market, account
            order by
                id
        ), 0) as last_size
    from
        {{ ref('v2_perp_position_modified_optimism_mainnet') }}

    {% if is_incremental() %}
        where
            block_number > (
                select COALESCE(MAX(block_number), 0)
                from
                    {{ this }}
            )
    {% endif %}
)

select
    trade_base.id,
    block_timestamp as ts,
    trade_base.block_number,
    transaction_hash,
    {{ convert_wei('last_price') }} as price,
    account,
    market,
    {{ convert_wei('margin') }} as margin,
    {{ convert_wei('trade_size') }} as trade_size,
    {{ convert_wei('size') }} as "size",
    {{ convert_wei('last_size') }} as last_size,
    {{ convert_wei('skew') }} as skew,
    {{ convert_wei('fee') }} as fee,
    order_type,
    UPPER(
        COALESCE(
            {{ convert_hex('tracking_code.tracking_code') }}, 'NO TRACKING CODE'
        )
    ) as tracking_code
from
    trade_base
left join
    {{ ref('fct_v2_trade_tracking_optimism_mainnet') }}
    as tracking_code
    on trade_base.id = tracking_code.id
where
    trade_size != 0
