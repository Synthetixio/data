WITH inc_market AS (
  SELECT
    ts,
    market_symbol,
    trades,
    fees,
    volume,
    liquidations,
    cumulative_fees,
    cumulative_volume
  FROM
    {{ ref('fct_perp_market_stats_hourly') }}
),
liq AS (
  SELECT
    ts,
    total_reward,
    1 AS liquidated_accounts
  FROM
    {{ ref('fct_perp_liq_account') }}
),
inc_liq AS (
  SELECT
    DATE_TRUNC(
      'hour',
      ts
    ) AS ts,
    SUM(total_reward) AS liquidation_rewards,
    SUM(liquidated_accounts) AS liquidated_accounts
  FROM
    liq
  GROUP BY
    1
),
inc_trade AS (
  SELECT
    ts,
    SUM(trades) AS trades,
    SUM(fees) AS fees,
    SUM(volume) AS volume,
    SUM(cumulative_fees) AS cumulative_fees,
    SUM(cumulative_volume) AS cumulative_volume
  FROM
    inc_market
  GROUP BY
    1
),
inc AS (
  SELECT
    h.ts,
    COALESCE(
      h.trades,
      0
    ) AS trades,
    COALESCE(
      h.fees,
      0
    ) AS fees,
    COALESCE(
      h.volume,
      0
    ) AS volume,
    COALESCE(
      l.liquidation_rewards,
      0
    ) AS liquidation_rewards,
    COALESCE(
      l.liquidated_accounts,
      0
    ) AS liquidated_accounts,
    COALESCE(
      h.cumulative_fees,
      0
    ) AS cumulative_fees,
    COALESCE(
      h.cumulative_volume,
      0
    ) AS cumulative_volume
  FROM
    inc_trade h
    LEFT JOIN inc_liq l
    ON h.ts = l.ts
)
SELECT
  *
FROM
  inc
