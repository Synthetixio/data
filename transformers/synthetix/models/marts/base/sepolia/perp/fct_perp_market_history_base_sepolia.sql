with base as (
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
        + {{ convert_wei('interest_rate') }} as short_rate_apr,
        LAG({{ convert_wei('size') }}, 1, 0) over (
            partition by m.market_symbol
            order by
                mu.block_timestamp
        ) as prev_size
    from
        {{ ref('perp_market_updated_base_sepolia') }} as mu
    left join {{ ref('fct_perp_markets_base_sepolia') }} as m
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
