WITH events AS (
  SELECT
    block_timestamp,
    {{ convert_wei('token_amount') }} AS token_amount,
    collateral_type
  FROM
    {{ ref('core_deposited') }}
  UNION ALL
  SELECT
    block_timestamp,- {{ convert_wei('token_amount') }} AS token_amount,
    collateral_type
  FROM
    {{ ref('core_withdrawn') }}
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
