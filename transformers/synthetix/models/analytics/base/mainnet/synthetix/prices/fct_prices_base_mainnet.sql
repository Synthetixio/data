{{
    config(
        materialized = "view",
        tags = ["analytics", "prices", "base", "mainnet"],
    )
}}

with all_prices as (
    select
        ts,
        null as market_address,
        market_symbol,
        price
    from
        {{ ref('fct_perp_market_history_base_mainnet') }}
    union all
    select
        ts,
        null as market_address,
        'SNX' as market_symbol,
        snx_price as price
    from
        {{ ref('fct_buyback_base_mainnet') }}
    where
        snx_price > 0
    union all
    select
        ts,
        collateral_type as market_address,
        null as market_symbol,
        collateral_value / amount as price
    from
        {{ ref('core_vault_collateral_base_mainnet') }}
    where
        collateral_value > 0
),

tokens as (
    select
        token_address,
        token_symbol
    from
        {{ ref('base_mainnet_tokens') }}
)

select
    p.ts,
    p.market_address,
    p.price,
    COALESCE(
        t.token_symbol,
        p.market_symbol
    ) as market_symbol
from
    all_prices as p
left join tokens as t
    on LOWER(
        p.market_address
    ) = LOWER(
        t.token_address
    )