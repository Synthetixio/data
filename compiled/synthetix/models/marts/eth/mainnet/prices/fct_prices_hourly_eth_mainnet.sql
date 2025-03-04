with prices as (
    select distinct
        market_symbol,
        DATE_TRUNC(
            'hour',
            ts
        ) as ts,
        LAST_VALUE(price) over (
            partition by DATE_TRUNC('hour', ts), market_symbol
            order by
                ts
            rows between unbounded preceding
            and unbounded following
        ) as price
    from
        "analytics"."prod_eth_mainnet"."fct_prices_eth_mainnet"
),

dim as (
    select
        m.market_symbol,
        GENERATE_SERIES(
            DATE_TRUNC('hour', MIN(t.ts)),
            DATE_TRUNC('hour', MAX(t.ts)),
            '1 hour'::INTERVAL
        ) as ts
    from
        (
            select ts
            from
                prices
        ) as t
    cross join (
        select distinct market_symbol
        from
            prices
    ) as m
    group by
        m.market_symbol
),

ffill as (
    select
        dim.ts,
        dim.market_symbol,
        LAST(prices.price) over (
            partition by dim.market_symbol
            order by dim.ts
            rows between unbounded preceding and current row
        ) as price
    from
        dim
    left join prices
        on
            dim.ts = prices.ts
            and dim.market_symbol = prices.market_symbol
),

hourly_prices as (
    select
        ts,
        market_symbol,
        price
    from
        ffill
)

select *
from
    hourly_prices
where
    price is not null