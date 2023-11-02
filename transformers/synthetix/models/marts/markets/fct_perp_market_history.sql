with base as ( 
  select
    mu.id,
    mu.block_timestamp as updated_ts,
    mu.block_number,
    mu.transaction_hash,
    m.id as market_id,
    m.market_symbol,
    {{ convert_wei('price') }} as price,
    {{ convert_wei('skew') }} as skew,
    {{ convert_wei('size') }} as size,
    {{ convert_wei('size_delta') }} as size_delta,
    {{ convert_wei('current_funding_rate') }} as funding_rate,
    {{ convert_wei('current_funding_velocity') }} as funding_velocity
  from 
    {{ ref('perp_market_updated') }} mu
    left join {{ ref('fct_perp_markets')}} m on mu.market_id=m.id
)

select
  *,
  size * price as size_usd,
  (size + skew) * price / 2 as long_oi,
  (size - skew) * price / 2 as short_oi,
  CASE 
    WHEN size * price = 0 THEN NULL
    ELSE ((size + skew) * price / 2) / (size * price)
  END AS long_oi_pct,
  CASE 
    WHEN size * price = 0 THEN NULL
    ELSE ((size - skew) * price / 2) / (size * price)
  END AS short_oi_pct
from base
