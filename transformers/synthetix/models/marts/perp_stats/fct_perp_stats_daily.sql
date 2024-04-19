SELECT
  DATE_TRUNC(
    'day',
    ts
  ) AS ts,
  SUM(trades) AS trades,
  SUM(exchange_fees) AS exchange_fees,
  SUM(referral_fees) AS referral_fees,
  SUM(collected_fees) AS collected_fees,
  SUM(volume) AS volume,
  SUM(liquidation_rewards) AS liquidation_rewards,
  SUM(liquidated_accounts) AS liquidated_accounts,
  MAX(cumulative_exchange_fees) AS cumulative_exchange_fees,
  MAX(cumulative_referral_fees) AS cumulative_referral_fees,
  MAX(cumulative_collected_fees) AS cumulative_collected_fees,
  MAX(cumulative_volume) AS cumulative_volume
FROM
  {{ ref('fct_perp_stats_hourly') }}
GROUP BY
  1
