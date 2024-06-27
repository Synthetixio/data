WITH bought AS (
  SELECT
    id,
    block_timestamp AS ts,
    block_number,
    transaction_hash AS tx_hash,
    synth_market_id,
    {{ convert_wei('price') }} AS price,
    {{ convert_wei('synth_returned') }} AS amount,
    referrer
  FROM
    {{ ref('spot_synth_bought_arbitrum_mainnet') }}
),
sold AS (
  SELECT
    id,
    block_timestamp AS ts,
    block_number,
    transaction_hash AS tx_hash,
    synth_market_id,
    {{ convert_wei('price') }} AS price,
    -1 * {{ convert_wei('amount_returned') }} AS amount,
    referrer
  FROM
    {{ ref('spot_synth_sold_arbitrum_mainnet') }}
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
