WITH base AS (
  SELECT
    CAST(
      account_id AS VARCHAR
    ) AS id,
    block_timestamp AS created_ts,
    "owner"
  FROM
    "analytics"."prod_raw_base_mainnet"."perp_account_created_base_mainnet"
)
SELECT
  *
FROM
  base