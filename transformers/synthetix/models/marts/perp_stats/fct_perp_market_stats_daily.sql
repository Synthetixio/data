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
      'day',
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
      'day',
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
dim AS (
  SELECT
    generate_series(DATE_TRUNC('day', MIN(t.ts)), DATE_TRUNC('day', MAX(t.ts)), '1 day' :: INTERVAL) AS ts,
    m.market_symbol
  FROM
    (
      SELECT
        ts
      FROM
        trades
    ) AS t
    CROSS JOIN (
      SELECT
        DISTINCT market_symbol
      FROM
        trades
    ) AS m
  GROUP BY
    m.market_symbol
),
inc AS (
  SELECT
    dim.ts,
    dim.market_symbol,
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
      PARTITION BY dim.market_symbol
      ORDER BY
        dim.ts
    ) AS cumulative_fees,
    SUM(
      h.volume
    ) over (
      PARTITION BY dim.market_symbol
      ORDER BY
        dim.ts
    ) AS cumulative_volume
  FROM
    dim
    LEFT JOIN inc_trades h
    ON dim.ts = h.ts
    AND dim.market_symbol = h.market_symbol
    LEFT JOIN inc_liq l
    ON dim.ts = l.ts
    AND dim.market_symbol = l.market_symbol
)
SELECT
  *
FROM
  inc
