WITH base AS (
  SELECT
    synth_market_id AS id,
    block_timestamp AS created_ts,
    block_number,
    synth_token_address AS token_address
  FROM
    "analytics"."prod_raw_base_mainnet"."spot_synth_registered_base_mainnet"
)
SELECT
  *
FROM
  base