WITH wraps AS (
  SELECT
    id,
    block_timestamp AS ts,
    block_number,
    transaction_hash AS tx_hash,
    synth_market_id,
    
    amount_wrapped / 1e18
 AS amount_wrapped
  FROM
    "analytics"."prod_raw_base_sepolia"."spot_synth_wrapped_base_sepolia"
),
unwraps AS (
  SELECT
    id,
    block_timestamp AS ts,
    block_number,
    transaction_hash AS tx_hash,
    synth_market_id,
    -1 * 
    amount_unwrapped / 1e18
 AS amount_wrapped
  FROM
    "analytics"."prod_raw_base_sepolia"."spot_synth_unwrapped_base_sepolia"
)
SELECT
  id,
  ts,
  block_number,
  tx_hash,
  synth_market_id,
  amount_wrapped
FROM
  wraps
UNION ALL
SELECT
  id,
  ts,
  block_number,
  tx_hash,
  synth_market_id,
  amount_wrapped
FROM
  unwraps
ORDER BY
  ts