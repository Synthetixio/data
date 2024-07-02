WITH base AS (
  SELECT
    perps_market_id AS id,
    block_timestamp AS created_ts,
    block_number,
    market_symbol,
    market_name
  FROM
    {{ ref('perp_market_created_base_mainnet') }}
)
SELECT
  *
FROM
  base
