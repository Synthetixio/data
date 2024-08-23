with trades as (
    select
        ts,
        account_id,
        total_fees,
        notional_trade_size,
        1 as trades,
        SUM(
            total_fees
        ) over (
            partition by account_id
            order by
                ts
        ) as cumulative_fees,
        SUM(
            notional_trade_size
        ) over (
            partition by account_id
            order by
                ts
        ) as cumulative_volume
    from
        {{ ref('fct_perp_trades_base_sepolia') }}
),

liq as (
    select
        ts,
        account_id,
        amount_liquidated,
        1 as liquidations
    from
        {{ ref('fct_perp_liq_position_base_sepolia') }}
),

inc_trades as (
    select
        DATE_TRUNC(
            'hour',
            ts
        ) as ts,
        account_id,
        SUM(trades) as trades,
        SUM(total_fees) as fees,
        SUM(notional_trade_size) as volume,
        MAX(cumulative_fees) as cumulative_fees,
        MAX(cumulative_volume) as cumulative_volume
    from
        trades
    group by
        1,
        2
),

inc_liq as (
    select
        DATE_TRUNC(
            'hour',
            ts
        ) as ts,
        account_id,
        SUM(amount_liquidated) as amount_liquidated,
        SUM(liquidations) as liquidations
    from
        liq
    group by
        1,
        2
),

inc as (
    select
        h.ts,
        h.account_id,
        COALESCE(
            h.trades,
            0
        ) as trades,
        COALESCE(
            h.fees,
            0
        ) as fees,
        COALESCE(
            h.volume,
            0
        ) as volume,
        COALESCE(
            l.amount_liquidated,
            0
        ) as amount_liquidated,
        COALESCE(
            l.liquidations,
            0
        ) as liquidations,
        COALESCE(
            h.cumulative_fees,
            0
        ) as cumulative_fees,
        COALESCE(
            h.cumulative_volume,
            0
        ) as cumulative_volume
    from
        inc_trades as h
    left join inc_liq as l
        on
            h.ts = l.ts
            and h.account_id = l.account_id
)

select *
from
    inc
