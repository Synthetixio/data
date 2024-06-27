WITH base AS (
  SELECT
    CAST(
      account_id AS VARCHAR
    ) AS id,
    block_timestamp AS created_ts,
    "owner"
  FROM
    {{ ref('perp_account_created_base_sepolia') }}
)
SELECT
  *
FROM
  base
