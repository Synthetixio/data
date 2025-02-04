{{
    config(
        materialized = "view",
        tags = ["analytics", "prices", "eth", "mainnet"],
    )
}}

with all_prices as (
    select
        ts,
        collateral_type as market_address,
        null as market_symbol,
        collateral_value / amount as price
    from
        {{ ref('core_vault_collateral_eth_mainnet') }}
    where
        collateral_value > 0
),

tokens as (
    select
        token_address,
        token_symbol
    from
        {{ ref('eth_mainnet_tokens') }}
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