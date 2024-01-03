WITH liquidation_events AS (
  SELECT
    account_id,
    reward,
    block_timestamp,
    full_liquidation,
    SUM(
      CASE
        WHEN full_liquidation THEN 1
        ELSE 0
      END
    ) over (
      PARTITION BY account_id
      ORDER BY
        block_timestamp rows BETWEEN unbounded preceding
        AND CURRENT ROW
    ) AS liquidation_id
  FROM
    {{ ref('perp_account_liquidation_attempt') }}
),
cumulative_rewards AS (
  SELECT
    CAST(
      le.account_id AS text
    ) AS account_id,
    le.block_timestamp,
    le.reward,
    le.full_liquidation,
    le.liquidation_id,
    SUM({{ convert_wei('reward') }}) over (
      PARTITION BY le.account_id,
      le.liquidation_id
      ORDER BY
        le.block_timestamp
    ) AS cumulative_reward,
    ROW_NUMBER() over (
      PARTITION BY le.account_id,
      le.liquidation_id
      ORDER BY
        le.block_timestamp DESC
    ) AS rn
  FROM
    liquidation_events le
  ORDER BY
    block_timestamp
)
SELECT
  account_id,
  block_timestamp AS ts,
  cumulative_reward AS total_reward
FROM
  cumulative_rewards
WHERE
  rn = 1
