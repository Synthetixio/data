WITH base AS (
  SELECT
    pool_id AS id,
    block_timestamp AS created_ts,
    block_number,
    owner
  FROM
    "analytics"."prod_raw_base_sepolia"."core_pool_created_base_sepolia"
)
SELECT
  *
FROM
  base