WITH events AS (
  SELECT
    block_timestamp,
    
    token_amount / 1e18
 AS token_amount,
    collateral_type
  FROM
    "analytics"."prod_raw_base_sepolia"."core_deposited_base_sepolia"
  UNION ALL
  SELECT
    block_timestamp,- 
    token_amount / 1e18
 AS token_amount,
    collateral_type
  FROM
    "analytics"."prod_raw_base_sepolia"."core_withdrawn_base_sepolia"
),
ranked_events AS (
  SELECT
    *,
    SUM(token_amount) over (
      PARTITION BY collateral_type
      ORDER BY
        block_timestamp rows BETWEEN unbounded preceding
        AND CURRENT ROW
    ) AS amount_deposited
  FROM
    events
)
SELECT
  block_timestamp AS ts,
  collateral_type,
  amount_deposited
FROM
  ranked_events
ORDER BY
  block_timestamp,
  collateral_type