WITH trades AS (
  SELECT
    DATE_TRUNC(
      'hour',
      ts
    ) AS ts,
    tracking_code,
    SUM(exchange_fees) AS exchange_fees,
    SUM(referral_fees) AS referral_fees,
    SUM(collected_fees) AS collected_fees,
    SUM(notional_trade_size) AS volume,
    SUM(1) AS trades
  FROM
    {{ ref('fct_perp_trades') }}
  GROUP BY
    1,
    2
),
accounts AS (
  SELECT
    DATE_TRUNC(
      'hour',
      ts
    ) AS ts,
    tracking_code,
    COUNT(
      DISTINCT account_id
    ) AS accounts
  FROM
    {{ ref('fct_perp_trades') }}
  GROUP BY
    1,
    2
),
total AS (
  SELECT
    ts,
    SUM(trades) AS trades_total,
    SUM(exchange_fees) AS exchange_fees_total,
    SUM(referral_fees) AS referral_fees_total,
    SUM(collected_fees) AS collected_fees_total,
    SUM(volume) AS volume_total
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
  trades.exchange_fees / total.exchange_fees_total AS exchange_fees_share,
  trades.referral_fees / total.referral_fees_total AS referral_fees_share,
  trades.collected_fees / total.collected_fees_total AS collected_fees_share,
  trades.volume / total.volume_total AS volume_share,
  trades.trades / total.trades_total AS trades_share
FROM
  trades
  JOIN accounts
  ON trades.ts = accounts.ts
  AND trades.tracking_code = accounts.tracking_code
  JOIN total
  ON trades.ts = total.ts
