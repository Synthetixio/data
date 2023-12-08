WITH stats AS (
  SELECT
    DATE_TRUNC(
      'day',
      ts
    ) AS ts,
    tracking_code,
    SUM(trades) AS trades,
    SUM(fees) AS fees,
    SUM(volume) AS volume
  FROM
    {{ ref('fct_perp_tracking_stats_hourly') }}
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
    {{ ref('fct_perp_trades') }}
  GROUP BY
    1,
    2
),
total AS (
  SELECT
    ts,
    SUM(trades) AS trades_total,
    SUM(fees) AS fees_total,
    SUM(volume) AS volume_total
  FROM
    stats
  GROUP BY
    1
)
SELECT
  stats.ts,
  stats.tracking_code,
  stats.trades,
  stats.fees,
  stats.volume,
  accounts.accounts,
  stats.fees / total.fees_total AS fees_share,
  stats.volume / total.volume_total AS volume_share,
  stats.trades / total.trades_total AS trades_share
FROM
  stats
  JOIN accounts
  ON stats.ts = accounts.ts
  AND stats.tracking_code = accounts.tracking_code
  JOIN total
  ON stats.ts = total.ts
