with inc_market as (
  select
    ts,
    market_symbol,
    trades,
    fees,
    volume,
    liquidations,
    cumulative_fees,
    cumulative_volume
  from
    {{ ref('fct_perp_market_stats_daily') }}
),

liq as (
  select
    ts,
    total_reward,
    1 as liquidated_accounts
  from
    {{ ref('fct_perp_liq_account') }}
),

inc_liq as (
  select
    date_trunc('day', ts) as ts,
    sum(total_reward) as liquidation_rewards,
    sum(liquidated_accounts) as liquidated_accounts
  from
    liq
  group by
    1
),

inc_trade as (
  select
    ts,
    sum(trades) as trades,
    sum(fees) as fees,
    sum(volume) as volume,
    sum(cumulative_fees) as cumulative_fees,
    sum(cumulative_volume) as cumulative_volume
  from
    inc_market
  group by
    1
),

inc as (
  select
    h.ts,
    COALESCE(h.trades, 0) as trades,
    COALESCE(h.fees, 0) as fees,
    COALESCE(h.volume, 0) as volume,
    COALESCE(l.liquidation_rewards, 0) as liquidation_rewards,
    COALESCE(l.liquidated_accounts, 0) as liquidated_accounts,
    COALESCE(h.cumulative_fees, 0) as cumulative_fees,
    COALESCE(h.cumulative_volume, 0) as cumulative_volume
  from
    inc_trade h
  left join
    inc_liq l
  on
    h.ts = l.ts
)

select * from inc