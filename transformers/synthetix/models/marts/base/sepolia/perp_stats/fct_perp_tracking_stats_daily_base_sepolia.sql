WITH trades AS (
  SELECT
    DATE_TRUNC(
      'day',
      ts
    ) AS ts,
    tracking_code,
    SUM(exchange_fees) AS exchange_fees,
    SUM(referral_fees) AS referral_fees,
    SUM(collected_fees) AS collected_fees,
    SUM(volume) AS volume,
    SUM(trades) AS trades
  FROM
    {{ ref('fct_perp_tracking_stats_hourly_base_sepolia') }}
  GROUP BY
    1,
    2
),
accounts AS (
  SELECT
    DATE_TRUNC(
      'day',
      ts
    ) AS ts,
    tracking_code,
    COUNT(
      DISTINCT account_id
    ) AS accounts
  FROM
    {{ ref('fct_perp_trades_base_sepolia') }}
  GROUP BY
    1,
    2
),
total AS (
  SELECT
    ts,
    SUM(exchange_fees) AS exchange_fees_total,
    SUM(referral_fees) AS referral_fees_total,
    SUM(collected_fees) AS collected_fees_total,
    SUM(volume) AS volume_total,
    SUM(trades) AS trades_total
  FROM
    trades
  GROUP BY
    1
)
SELECT
  trades.ts,
  trades.tracking_code,
  trades.exchange_fees,
  trades.referral_fees,
  trades.collected_fees,
  trades.volume,
  trades.trades,
  accounts.accounts,
  CASE
    WHEN total.exchange_fees_total = 0 THEN 0
    ELSE trades.exchange_fees / total.exchange_fees_total
  END AS exchange_fees_share,
  CASE
    WHEN total.referral_fees_total = 0 THEN 0
    ELSE trades.referral_fees / total.referral_fees_total
  END AS referral_fees_share,
  CASE
    WHEN total.collected_fees_total = 0 THEN 0
    ELSE trades.collected_fees / total.collected_fees_total
  END AS collected_fees_share,
  CASE
    WHEN total.volume_total = 0 THEN 0
    ELSE trades.volume / total.volume_total
  END AS volume_share,
  CASE
    WHEN total.trades_total = 0 THEN 0
    ELSE trades.trades / total.trades_total
  END AS trades_share
FROM
  trades
  JOIN accounts
  ON trades.ts = accounts.ts
  AND trades.tracking_code = accounts.tracking_code
  JOIN total
  ON trades.ts = total.ts
