WITH daily AS (
  SELECT
    DATE_TRUNC(
      'day',
      ts
    ) AS ts,
    account_id,
    SUM(fees) AS fees,
    SUM(volume) AS volume,
    SUM(amount_liquidated) AS amount_liquidated,
    SUM(liquidations) AS liquidations
  FROM
    {{ ref('fct_perp_account_stats_hourly') }}
  GROUP BY
    1,
    2
),
stats AS (
  SELECT
    daily.*,
    SUM(fees) over (
      PARTITION BY account_id
      ORDER BY
        ts RANGE BETWEEN unbounded preceding
        AND CURRENT ROW
    ) AS cumulative_fees,
    SUM(volume) over (
      PARTITION BY account_id
      ORDER BY
        ts RANGE BETWEEN unbounded preceding
        AND CURRENT ROW
    ) AS cumulative_volume
  FROM
    daily
)
SELECT
  *
FROM
  stats
