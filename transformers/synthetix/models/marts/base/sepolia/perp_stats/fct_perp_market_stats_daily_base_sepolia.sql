SELECT
  DATE_TRUNC(
    'day',
    ts
  ) AS ts,
  market_symbol,
  SUM(trades) AS trades,
  SUM(exchange_fees) AS exchange_fees,
  SUM(referral_fees) AS referral_fees,
  SUM(collected_fees) AS collected_fees,
  SUM(volume) AS volume,
  SUM(amount_liquidated) AS amount_liquidated,
  SUM(liquidations) AS liquidations,
  MAX(cumulative_exchange_fees) AS cumulative_exchange_fees,
  MAX(cumulative_referral_fees) AS cumulative_referral_fees,
  MAX(cumulative_collected_fees) AS cumulative_collected_fees,
  MAX(cumulative_volume) AS cumulative_volume
FROM
  {{ ref('fct_perp_market_stats_hourly_base_sepolia') }}
GROUP BY
  1,
  2
