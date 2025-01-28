{{
    config(
        materialized = 'view',
        tags = ["analytics", "core", "base", "mainnet"],
    )
}}

with dim as (
    select distinct
        p.ts as ts,
        p.pool_id as pool_id,
        p.collateral_type as collateral_type,
        t.token_symbol as token_symbol,
        t.yield_token_symbol as yield_token_symbol
    from
        {{ ref('fct_pool_pnl_hourly_base_mainnet') }}
        as p
    inner join
        {{ ref('base_mainnet_tokens') }}
        as t
        on lower(p.collateral_type) = lower(t.token_address)
    where
        t.yield_token_symbol is not null
),

token_prices as (
    select
        dim.ts as ts,
        dim.pool_id as pool_id,
        dim.collateral_type as collateral_type,
        dim.token_symbol as token_symbol,
        dim.yield_token_symbol as yield_token_symbol,
        tp.price as token_price,
        yp.price as yield_token_price,
        tp.price / yp.price as exchange_rate
    from
        dim
    inner join {{ ref('fct_prices_hourly_base_mainnet') }} as tp
        on
            dim.token_symbol = tp.market_symbol
            and dim.ts = tp.ts
    inner join {{ ref('fct_prices_hourly_base_mainnet') }} as yp
        on
            dim.yield_token_symbol = yp.market_symbol
            and dim.ts = yp.ts
),

rate_changes as (
    select
        ts as ts,
        pool_id as pool_id,
        collateral_type as collateral_type,
        exchange_rate as exchange_rate,
        exchange_rate / lagInFrame(exchange_rate) over (
            partition by token_symbol, yield_token_symbol
            order by
                ts
            rows between unbounded preceding and unbounded following
        ) - 1 as hourly_exchange_rate_pnl
    from
        token_prices
)

select
    ts as ts,
    pool_id as pool_id,
    collateral_type as collateral_type,
    exchange_rate as exchange_rate,
    hourly_exchange_rate_pnl as hourly_exchange_rate_pnl,
    avg(hourly_exchange_rate_pnl) over (
        partition by collateral_type
        order by
            ts
        range between 60*60*24 preceding
        and current row
    ) * 24 * 365 as apr_24h_underlying,
    avg(hourly_exchange_rate_pnl) over (
        partition by collateral_type
        order by
            ts
        range between 60*60*24*7 preceding
        and current row
    ) * 24 * 365 as apr_7d_underlying,
    avg(hourly_exchange_rate_pnl) over (
        partition by collateral_type
        order by
            ts
        range between 60*60*24*28 preceding
        and current row
    ) * 24 * 365 as apr_28d_underlying
from
    rate_changes
