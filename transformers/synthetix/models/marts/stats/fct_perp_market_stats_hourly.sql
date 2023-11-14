with trades as (
  select
    ts,
    market_symbol,
    total_fees,
    notional_trade_size,
    1 as trades
  from
    {{ ref('fct_perp_trades') }}
),

liq as (
  select
    ts,
    market_symbol,
    amount_liquidated,
    1 as liquidations
  from
    {{ ref('fct_perp_liq_position') }}
),

inc_trades as (
  select
    date_trunc('hour', ts) as ts,
    market_symbol,
    sum(trades) as trades,
    sum(total_fees) as fees,
    sum(notional_trade_size) as volume
  from
    trades
  group by
    1, 2
),

inc_liq as (
  select
    date_trunc('hour', ts) as ts,
    market_symbol,
    sum(amount_liquidated) as amount_liquidated,
    sum(liquidations) as liquidations
  from
    liq
  group by
    1, 2
),

inc as (
  select
    h.ts,
    h.market_symbol,
    COALESCE(h.trades, 0) as trades,
    COALESCE(h.fees, 0) as fees,
    COALESCE(h.volume, 0) as volume,
    COALESCE(l.amount_liquidated, 0) as amount_liquidated,
    COALESCE(l.liquidations, 0) as liquidations,
    sum(h.fees) over (order by h.ts) as cumulative_fees,
    sum(h.volume) over (order by h.ts) as cumulative_volume
  from
    inc_trades h
  left join
    inc_liq l
  on
    h.ts = l.ts
)
select * from inc