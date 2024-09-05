with trades as (
    select
        ts,
        market_symbol,
        exchange_fees,
        referral_fees,
        collected_fees,
        notional_trade_size,
        1 as trades
    from
        {{ ref('fct_perp_trades_arbitrum_mainnet') }}
),

liq as (
    select
        ts,
        market_symbol,
        amount_liquidated,
        1 as liquidations
    from
        {{ ref('fct_perp_liq_position_arbitrum_mainnet') }}
),

inc_trades as (
    select
        DATE_TRUNC(
            'hour',
            ts
        ) as ts,
        market_symbol,
        SUM(trades) as trades,
        SUM(exchange_fees) as exchange_fees,
        SUM(referral_fees) as referral_fees,
        SUM(collected_fees) as collected_fees,
        SUM(notional_trade_size) as volume
    from
        trades
    group by
        DATE_TRUNC(
            'hour',
            ts
        ),
        market_symbol
),

inc_liq as (
    select
        DATE_TRUNC(
            'hour',
            ts
        ) as ts,
        market_symbol,
        SUM(amount_liquidated) as amount_liquidated,
        SUM(liquidations) as liquidations
    from
        liq
    group by
        DATE_TRUNC(
            'hour',
            ts
        ),
        market_symbol
),

dim as (
    select
        m.market_symbol,
        GENERATE_SERIES(
            DATE_TRUNC('hour', MIN(t.ts)),
            DATE_TRUNC('hour', MAX(t.ts)),
            '1 hour'::INTERVAL
        ) as ts
    from
        (
            select ts
            from
                trades
        ) as t
    cross join (
        select distinct market_symbol
        from
            trades
    ) as m
    group by
        m.market_symbol
),

inc as (
    select
        dim.ts,
        dim.market_symbol,
        COALESCE(
            h.trades,
            0
        ) as trades,
        COALESCE(
            h.exchange_fees,
            0
        ) as exchange_fees,
        COALESCE(
            h.referral_fees,
            0
        ) as referral_fees,
        COALESCE(
            h.collected_fees,
            0
        ) as collected_fees,
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
        SUM(
            h.exchange_fees
        ) over (
            partition by dim.market_symbol
            order by
                dim.ts
        ) as cumulative_exchange_fees,
        SUM(
            h.referral_fees
        ) over (
            partition by dim.market_symbol
            order by
                dim.ts
        ) as cumulative_referral_fees,
        SUM(
            h.collected_fees
        ) over (
            partition by dim.market_symbol
            order by
                dim.ts
        ) as cumulative_collected_fees,
        SUM(
            h.volume
        ) over (
            partition by dim.market_symbol
            order by
                dim.ts
        ) as cumulative_volume
    from
        dim
    left join inc_trades as h
        on
            dim.ts = h.ts
            and dim.market_symbol = h.market_symbol
    left join inc_liq as l
        on
            dim.ts = l.ts
            and dim.market_symbol = l.market_symbol
)

select *
from
    inc
