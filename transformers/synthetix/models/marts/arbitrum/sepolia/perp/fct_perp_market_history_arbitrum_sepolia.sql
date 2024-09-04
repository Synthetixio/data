with arbitrum as (
    select
        mu.id,
        mu.block_timestamp as ts,
        mu.block_number,
        mu.transaction_hash,
        m.id as market_id,
        m.market_symbol,
        {{ convert_wei('price') }} as price,
        {{ convert_wei('skew') }} as skew,
        {{ convert_wei('size') }} as size,
        {{ convert_wei('size_delta') }} as size_delta,
        {{ convert_wei('current_funding_rate') }} as funding_rate,
        {{ convert_wei('current_funding_velocity') }} as funding_velocity,
        {{ convert_wei('interest_rate') }} as interest_rate,
        {{ convert_wei('current_funding_rate') }} * 365.25 as funding_rate_apr,
        {{ convert_wei('current_funding_rate') }} * 365.25
        + {{ convert_wei('interest_rate') }} as long_rate_apr,
        {{ convert_wei('current_funding_rate') }} * -1 * 365.25
        + {{ convert_wei('interest_rate') }} as short_rate_apr
    from
        {{ ref('perp_market_updated_arbitrum_sepolia') }}
        as mu
    left join
        {{ ref('fct_perp_markets_arbitrum_sepolia') }}
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
