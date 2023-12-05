WITH base AS (
  SELECT
    pool_id AS id,
    block_timestamp AS created_ts,
    block_number,
    owner
  FROM
    {{ ref('core_pool_created') }}
)
SELECT
  *
FROM
  base
