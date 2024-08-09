WITH bought AS (
  SELECT
    id,
    block_timestamp AS ts,
    block_number,
    transaction_hash AS tx_hash,
    synth_market_id,
    
    price / 1e18
 AS price,
    
    synth_returned / 1e18
 AS amount,
    referrer
  FROM
    "analytics"."prod_raw_base_mainnet"."spot_synth_bought_base_mainnet"
),
sold AS (
  SELECT
    id,
    block_timestamp AS ts,
    block_number,
    transaction_hash AS tx_hash,
    synth_market_id,
    
    price / 1e18
 AS price,
    -1 * 
    amount_returned / 1e18
 AS amount,
    referrer
  FROM
    "analytics"."prod_raw_base_mainnet"."spot_synth_sold_base_mainnet"
)
SELECT
  id,
  ts,
  block_number,
  tx_hash,
  synth_market_id,
  price,
  amount,
  referrer
FROM
  bought
UNION ALL
SELECT
  id,
  ts,
  block_number,
  tx_hash,
  synth_market_id,
  price,
  amount,
  referrer
FROM
  sold
ORDER BY
  ts