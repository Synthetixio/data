WITH base AS (
  SELECT
    synth_market_id AS id,
    block_timestamp AS created_ts,
    block_number,
    synth_token_address AS token_address
  FROM
    "analytics"."prod_raw_arbitrum_sepolia"."spot_synth_registered_arbitrum_sepolia"
)
SELECT
  *
FROM
  base