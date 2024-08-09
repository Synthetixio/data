WITH base AS (
  SELECT
    mu.id,
    mu.block_timestamp AS ts,
    mu.block_number,
    mu.transaction_hash,
    m.id AS market_id,
    m.market_symbol,
    
    price / 1e18
 AS price,
    
    skew / 1e18
 AS skew,
    
    size / 1e18
 AS SIZE,
    
    size_delta / 1e18
 AS size_delta,
    
    current_funding_rate / 1e18
 AS funding_rate,
    
    current_funding_velocity / 1e18
 AS funding_velocity,
    
    interest_rate / 1e18
 AS interest_rate,
    
    current_funding_rate / 1e18
 * 365.25 AS funding_rate_apr,
    
    current_funding_rate / 1e18
 * 365.25 + 
    interest_rate / 1e18
 AS long_rate_apr,
    
    current_funding_rate / 1e18
 * -1 * 365.25 + 
    interest_rate / 1e18
 AS short_rate_apr
  FROM
    "analytics"."prod_raw_base_sepolia"."perp_market_updated_base_sepolia"
    mu
    LEFT JOIN "analytics"."prod_base_sepolia"."fct_perp_markets_base_sepolia"
    m
    ON mu.market_id = m.id
)
SELECT
  *,
  SIZE * price AS size_usd,
  (
    SIZE + skew
  ) * price / 2 AS long_oi,
  (
    SIZE - skew
  ) * price / 2 AS short_oi,
  CASE
    WHEN SIZE * price = 0 THEN NULL
    ELSE ((SIZE + skew) * price / 2) / (
      SIZE * price
    )
  END AS long_oi_pct,
  CASE
    WHEN SIZE * price = 0 THEN NULL
    ELSE ((SIZE - skew) * price / 2) / (
      SIZE * price
    )
  END AS short_oi_pct
FROM
  base