{{ config(
    materialized = "view",
    tags = ["perp", "liq_position", "base", "mainnet"]
) }}

with liquidations as (
    select
        id,
        block_timestamp as ts,
        block_number,
        transaction_hash,
        account_id,
        market_id,
        {{ convert_wei('amount_liquidated') }} as amount_liquidated,
        {{ convert_wei('current_position_size') }} as position_size
    from
        {{ ref('perp_position_liquidated_base_mainnet') }}
),

markets as (
    select
        id,
        market_symbol
    from
        {{ ref('fct_perp_markets_base_mainnet') }}
)

select
    l.id,
    l.ts,
    l.block_number,
    l.transaction_hash,
    l.market_id,
    m.market_symbol,
    l.amount_liquidated,
    l.position_size,
    CAST(
        l.account_id as text
    ) as account_id
from
    liquidations as l
left join markets as m
    on l.market_id = m.id