WITH inc_market AS (
  SELECT
    ts,
    market_symbol,
    trades,
    exchange_fees,
    referral_fees,
    collected_fees,
    volume,
    liquidations,
    cumulative_exchange_fees,
    cumulative_referral_fees,
    cumulative_collected_fees,
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
    SUM(exchange_fees) AS exchange_fees,
    SUM(referral_fees) AS referral_fees,
    SUM(collected_fees) AS collected_fees,
    SUM(volume) AS volume,
    SUM(cumulative_exchange_fees) AS cumulative_exchange_fees,
    SUM(cumulative_referral_fees) AS cumulative_referral_fees,
    SUM(cumulative_collected_fees) AS cumulative_collected_fees,
    SUM(cumulative_volume) AS cumulative_volume
  FROM
    inc_market
  GROUP BY
    1
),
inc AS (
  SELECT
    h.ts,
    h.trades,
    h.exchange_fees,
    h.referral_fees,
    h.collected_fees,
    h.volume,
    COALESCE(
      l.liquidation_rewards,
      0
    ) AS liquidation_rewards,
    COALESCE(
      l.liquidated_accounts,
      0
    ) AS liquidated_accounts,
    h.cumulative_exchange_fees,
    h.cumulative_referral_fees,
    h.cumulative_collected_fees,
    h.cumulative_volume
  FROM
    inc_trade h
    LEFT JOIN inc_liq l
    ON h.ts = l.ts
)
SELECT
  *
FROM
  inc
