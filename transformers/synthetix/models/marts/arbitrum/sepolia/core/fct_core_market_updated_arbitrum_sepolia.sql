WITH market_updated AS (
  SELECT
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    market_id,
    net_issuance,
    sender,
    collateral_type,
    credit_capacity,
    token_amount
  FROM
    {{ ref('core_market_updated_arbitrum_sepolia') }}
)
SELECT
  id,
  block_timestamp AS ts,
  transaction_hash,
  event_name,
  market_id,
  collateral_type,
  {{ convert_wei("credit_capacity") }} AS credit_capacity,
  {{ convert_wei("net_issuance") }} AS net_issuance,
  {{ convert_wei("token_amount") }} AS token_amount
FROM
  market_updated
