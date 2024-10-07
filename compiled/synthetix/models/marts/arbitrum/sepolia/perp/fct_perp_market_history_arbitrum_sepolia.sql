with arbitrum as (
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
 as short_rate_apr
    from
        "analytics"."prod_raw_arbitrum_sepolia"."perp_market_updated_arbitrum_sepolia"
        as mu
    left join
        "analytics"."prod_arbitrum_sepolia"."fct_perp_markets_arbitrum_sepolia"
        as m
        on mu.market_id = m.id
)

select
    *,
    size * price as size_usd,
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
    arbitrum