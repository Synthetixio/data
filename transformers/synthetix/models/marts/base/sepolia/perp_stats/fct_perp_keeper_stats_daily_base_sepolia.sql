WITH hourly AS (
  SELECT
    DATE_TRUNC(
      'day',
      ts
    ) AS ts,
    keeper,
    settlement_rewards,
    amount_settled,
    trades
  FROM
    {{ ref('fct_perp_keeper_stats_hourly_base_sepolia') }}
),
total AS (
  SELECT
    ts,
    SUM(trades) AS trades_total,
    SUM(settlement_rewards) AS settlement_reward_total,
    SUM(amount_settled) AS amount_settled_total
  FROM
    hourly
  GROUP BY
    1
)
SELECT
  hourly.ts,
  keeper,
  SUM(trades) AS trades,
  SUM(settlement_rewards) AS settlement_rewards,
  SUM(amount_settled) AS amount_settled,
  SUM(trades) / MAX(trades_total) AS trades_pct,
  SUM(settlement_rewards) / MAX(settlement_reward_total) AS settlement_rewards_pct,
  SUM(amount_settled) / MAX(amount_settled_total) AS amount_settled_pct
FROM
  hourly
  JOIN total
  ON hourly.ts = total.ts
GROUP BY
  1,
  2
