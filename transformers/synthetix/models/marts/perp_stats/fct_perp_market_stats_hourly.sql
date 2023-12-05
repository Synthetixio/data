WITH trades AS (
  SELECT
    ts,
    market_symbol,
    total_fees,
    notional_trade_size,
    1 AS trades
  FROM
    {{ ref('fct_perp_trades') }}
),
liq AS (
  SELECT
    ts,
    market_symbol,
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
    market_symbol,
    SUM(trades) AS trades,
    SUM(total_fees) AS fees,
    SUM(notional_trade_size) AS volume
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
    market_symbol,
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
    h.market_symbol,
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
    SUM(
      h.fees
    ) over (
      ORDER BY
        h.ts
    ) AS cumulative_fees,
    SUM(
      h.volume
    ) over (
      ORDER BY
        h.ts
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
