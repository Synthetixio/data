WITH base AS (
  SELECT
    synth_market_id AS id,
    block_timestamp AS created_ts,
    block_number,
    synth_token_address AS token_address
  FROM
    {{ ref('spot_synth_registered_arbitrum_mainnet') }}
)
SELECT
  *
FROM
  base
