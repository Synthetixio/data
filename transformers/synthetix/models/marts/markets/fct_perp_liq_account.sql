WITH liquidation_events AS (
  SELECT
    account_id,
    reward,
    block_timestamp,
    full_liquidation,
    SUM(CASE WHEN full_liquidation THEN 1 ELSE 0 END) OVER (
      PARTITION BY account_id
      ORDER BY block_timestamp
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS liquidation_id
  FROM {{ ref('perp_account_liquidated') }}
),

cumulative_rewards AS (
  SELECT
    le.account_id,
    le.block_timestamp,
    le.reward,
    le.full_liquidation,
    le.liquidation_id,
    SUM({{ convert_wei('reward') }}) OVER (
      PARTITION BY le.account_id, le.liquidation_id
      ORDER BY le.block_timestamp
    ) AS cumulative_reward,
    ROW_NUMBER() OVER (
      PARTITION BY le.account_id, le.liquidation_id
      ORDER BY le.block_timestamp DESC
    ) AS rn
  FROM liquidation_events le
  ORDER BY block_timestamp
)

SELECT
  account_id,
  block_timestamp AS ts,
  reward,
  cumulative_reward
FROM cumulative_rewards
WHERE rn = 1
