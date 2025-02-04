{{
    config(
        materialized = "view",
        tags = ["analytics", "prices", "eth", "mainnet"],
    )
}}

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
        {{ ref('fct_prices_eth_mainnet') }}
),

dim as (
    select
        m.market_symbol,
        arrayJoin(
            arrayMap(
                x -> toDateTime(x),
                range(
                    toUInt32(date_trunc('hour', min(t.ts))),
                    toUInt32(date_trunc('hour', max(t.ts))),
                    3600
                )
            )
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
        LAST_VALUE(prices.price) over (
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

select
    ts,
    market_symbol,
    price
from
    hourly_prices
where
    price is not null