WITH trades AS (
  SELECT
    DATE_TRUNC(
      'hour',
      ts
    ) AS ts,
    settler,
    settlement_reward,
    notional_trade_size,
    1 AS trades
  FROM
    {{ ref('fct_perp_trades_base_sepolia') }}
),
total AS (
  SELECT
    ts,
    SUM(trades) AS trades_total,
    SUM(settlement_reward) AS settlement_reward_total,
    SUM(notional_trade_size) AS notional_trade_size_total
  FROM
    trades
  GROUP BY
    1
)
SELECT
  trades.ts,
  settler AS keeper,
  SUM(trades) AS trades,
  SUM(settlement_reward) AS settlement_rewards,
  SUM(notional_trade_size) AS amount_settled,
  SUM(trades) / MAX(trades_total) AS trades_pct,
  SUM(settlement_reward) / MAX(settlement_reward_total) AS settlement_rewards_pct,
  SUM(notional_trade_size) / MAX(notional_trade_size_total) AS amount_settled_pct
FROM
  trades
  JOIN total
  ON trades.ts = total.ts
GROUP BY
  1,
  2
