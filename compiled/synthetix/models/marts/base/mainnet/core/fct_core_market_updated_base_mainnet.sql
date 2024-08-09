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
    "analytics"."prod_raw_base_mainnet"."core_market_updated_base_mainnet"
)
SELECT
  id,
  block_timestamp AS ts,
  transaction_hash,
  event_name,
  market_id,
  collateral_type,
  
    credit_capacity / 1e18
 AS credit_capacity,
  
    net_issuance / 1e18
 AS net_issuance,
  
    token_amount / 1e18
 AS token_amount
FROM
  market_updated