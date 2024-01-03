WITH base AS (
  SELECT
    mu.id,
    mu.block_timestamp AS ts,
    mu.block_number,
    mu.transaction_hash,
    m.id AS market_id,
    m.market_symbol,
    {{ convert_wei('price') }} AS price,
    {{ convert_wei('skew') }} AS skew,
    {{ convert_wei('size') }} AS SIZE,
    {{ convert_wei('size_delta') }} AS size_delta,
    {{ convert_wei('current_funding_rate') }} AS funding_rate,
    {{ convert_wei('current_funding_velocity') }} AS funding_velocity
  FROM
    {{ ref('perp_market_updated') }}
    mu
    LEFT JOIN {{ ref('fct_perp_markets') }}
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
