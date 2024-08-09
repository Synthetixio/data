WITH base AS (
  SELECT
    perps_market_id AS id,
    block_timestamp AS created_ts,
    block_number,
    market_symbol,
    market_name
  FROM
    "analytics"."prod_raw_base_sepolia"."perp_market_created_base_sepolia"
)
SELECT
  *
FROM
  base