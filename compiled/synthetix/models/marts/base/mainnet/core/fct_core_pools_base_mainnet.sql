WITH base AS (
  SELECT
    pool_id AS id,
    block_timestamp AS created_ts,
    block_number,
    owner
  FROM
    "analytics"."prod_raw_base_mainnet"."core_pool_created_base_mainnet"
)
SELECT
  *
FROM
  base