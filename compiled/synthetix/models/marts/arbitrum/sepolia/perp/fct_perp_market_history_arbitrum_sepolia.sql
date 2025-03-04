with base as (
    select
        mu.id,
        mu.block_timestamp as ts,
        mu.block_number,
        mu.transaction_hash,
        m.id as market_id,
        m.market_symbol,
        
    price / 1e18
 as price,
        
    skew / 1e18
 as skew,
        
    size / 1e18
 as size,
        
    size_delta / 1e18
 as size_delta,
        
    current_funding_rate / 1e18
 as funding_rate,
        
    current_funding_velocity / 1e18
 as funding_velocity,
        
    interest_rate / 1e18
 as interest_rate,
        
    current_funding_rate / 1e18
 * 365.25 as funding_rate_apr,
        
    current_funding_rate / 1e18
 * 365.25
        + 
    interest_rate / 1e18
 as long_rate_apr,
        
    current_funding_rate / 1e18
 * -1 * 365.25
        + 
    interest_rate / 1e18
 as short_rate_apr,
        LAG(
    size / 1e18
, 1, 0) over (
            partition by m.market_symbol
            order by
                mu.block_timestamp
        ) as prev_size
    from
        "analytics"."prod_raw_arbitrum_sepolia"."perp_market_updated_arbitrum_sepolia" as mu
    left join "analytics"."prod_arbitrum_sepolia"."fct_perp_markets_arbitrum_sepolia" as m
        on mu.market_id = m.id
),

oi as (
    select
        id,
        ts,
        size * price as market_oi_usd,
        LAG(
            size * price,
            1,
            0
        ) over (
            partition by market_symbol
            order by
                ts asc
        ) as prev_market_oi_usd,
        (
            size + skew
        ) * price / 2 as long_oi,
        (
            size - skew
        ) * price / 2 as short_oi,
        case
            when size * price = 0 then null
            else ((size + skew) * price / 2) / (
                size * price
            )
        end as long_oi_pct,
        case
            when size * price = 0 then null
            else ((size - skew) * price / 2) / (
                size * price
            )
        end as short_oi_pct
    from
        base
),

total_oi as (
    select
        id,
        SUM(
            market_oi_usd - prev_market_oi_usd
        ) over (
            order by
                ts asc
        ) as total_oi_usd
    from
        oi
)

select
    base.*,
    ROUND(
        oi.market_oi_usd,
        2
    ) as market_oi_usd,
    ROUND(
        total_oi.total_oi_usd,
        2
    ) as total_oi_usd,
    ROUND(
        oi.long_oi,
        2
    ) as long_oi,
    ROUND(
        oi.short_oi,
        2
    ) as short_oi,
    oi.long_oi_pct,
    oi.short_oi_pct
from
    base
inner join oi
    on base.id = oi.id
inner join total_oi
    on base.id = total_oi.id