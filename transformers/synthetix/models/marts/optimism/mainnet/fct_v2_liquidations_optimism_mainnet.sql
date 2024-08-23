{{ config(
    materialized = 'incremental',
    unique_key = 'id',
) }}

with liq_trades as (
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
        COALESCE(LAG("size", 1) over (
            partition by market, account
            order by
                id
        ), 0) as last_size
    from
        {{ ref('v2_perp_position_modified_optimism_mainnet') }}
),

liq_events as (
    select
        block_number,
        account,
        market,
        transaction_hash,
        total_fee
    from
        {{ ref('v2_perp_position_liquidated_optimism_mainnet') }}

    {% if is_incremental() %}
        where
            block_number > (
                select COALESCE(MAX(block_number), 0) as b
                from
                    {{ this }}
            )
    {% endif %}
),

liq_base as (
    select
        lt.id,
        lt.block_timestamp,
        lt.block_number,
        lt.transaction_hash,
        lt.last_price,
        lt.account,
        lt.market,
        lt.margin,
        lt.last_size,
        lt.size,
        lt.skew,
        'liquidation' as order_type,
        null as tracking_code,
        -1 * lt.last_size as trade_size,
        lt.fee + le.total_fee as fee
    from
        liq_trades as lt
    inner join liq_events as le
        on
            lt.block_number = le.block_number
            and lt.account = le.account
            and lt.market = le.market
            and lt.transaction_hash = le.transaction_hash
    where
        lt.margin = 0
        and lt.trade_size = 0
        and lt.size = 0
        and lt.last_size != 0
)

select
    id,
    block_timestamp as ts,
    block_number,
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
    'liquidation' as order_type,
    null as tracking_code
from
    liq_base
