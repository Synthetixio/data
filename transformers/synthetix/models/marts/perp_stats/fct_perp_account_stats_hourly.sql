WITH trades AS (
  SELECT
    ts,
    account_id,
    total_fees,
    notional_trade_size,
    1 AS trades,
    SUM(
      total_fees
    ) over (
      PARTITION BY account_id
      ORDER BY
        ts
    ) AS cumulative_fees,
    SUM(
      notional_trade_size
    ) over (
      PARTITION BY account_id
      ORDER BY
        ts
    ) AS cumulative_volume
  FROM
    {{ ref('fct_perp_trades') }}
),
liq AS (
  SELECT
    ts,
    account_id,
    amount_liquidated,
    1 AS liquidations
  FROM
    {{ ref('fct_perp_liq_position') }}
),
inc_trades AS (
  SELECT
    DATE_TRUNC(
      'hour',
      ts
    ) AS ts,
    account_id,
    SUM(trades) AS trades,
    SUM(total_fees) AS fees,
    SUM(notional_trade_size) AS volume,
    MAX(cumulative_fees) AS cumulative_fees,
    MAX(cumulative_volume) AS cumulative_volume
  FROM
    trades
  GROUP BY
    1,
    2
),
inc_liq AS (
  SELECT
    DATE_TRUNC(
      'hour',
      ts
    ) AS ts,
    account_id,
    SUM(amount_liquidated) AS amount_liquidated,
    SUM(liquidations) AS liquidations
  FROM
    liq
  GROUP BY
    1,
    2
),
inc AS (
  SELECT
    h.ts,
    h.account_id,
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
      l.amount_liquidated,
      0
    ) AS amount_liquidated,
    COALESCE(
      l.liquidations,
      0
    ) AS liquidations,
    COALESCE(
      h.cumulative_fees,
      0
    ) AS cumulative_fees,
    COALESCE(
      h.cumulative_volume,
      0
    ) AS cumulative_volume
  FROM
    inc_trades h
    LEFT JOIN inc_liq l
    ON h.ts = l.ts
)
SELECT
  *
FROM
  inc
