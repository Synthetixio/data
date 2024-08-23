with raw_data as (
    select
        DATE_TRUNC(
            'day',
            ts
        ) as ts,
        market,
        MAX(id) as max_id,
        SUM(exchange_fees) as exchange_fees,
        SUM(liquidation_fees) as liquidation_fees,
        SUM(volume) as volume,
        SUM(amount_liquidated) as amount_liquidated,
        SUM(trades) as trades,
        SUM(liquidations) as liquidations
    from
        {{ ref('fct_v2_market_stats_optimism_mainnet') }}
    group by
        1,
        2
),

aggregated_data as (
    select
        a.ts,
        a.market,
        a.exchange_fees,
        a.liquidation_fees,
        a.volume,
        a.amount_liquidated,
        a.trades,
        a.liquidations,
        b.long_oi_usd,
        b.short_oi_usd,
        b.total_oi_usd,
        b.cumulative_exchange_fees,
        b.cumulative_liquidation_fees,
        b.cumulative_volume,
        b.cumulative_amount_liquidated,
        b.cumulative_trades,
        b.cumulative_liquidations
    from
        raw_data as a
    inner join
        {{ ref('fct_v2_market_stats_optimism_mainnet') }}
        as b
        on a.max_id = b.id
),

date_series as (
    select
        q.ts,
        q2.market
    from
        (
            select
                GENERATE_SERIES(
                    MIN(DATE_TRUNC('day', ts)),
                    MAX(DATE_TRUNC('day', ts)),
                    '1 day'::INTERVAL
                ) as ts
            from
                aggregated_data
        ) as q
    cross join (
        select distinct market
        from
            aggregated_data
    ) as q2
),

gap_data as (
    select
        ds.ts,
        ds.market,
        ad.long_oi_usd,
        ad.short_oi_usd,
        ad.total_oi_usd,
        ad.cumulative_exchange_fees,
        ad.cumulative_liquidation_fees,
        ad.cumulative_volume,
        ad.cumulative_amount_liquidated,
        ad.cumulative_trades,
        ad.cumulative_liquidations,
        COALESCE(
            ad.exchange_fees,
            0
        ) as exchange_fees,
        COALESCE(
            ad.liquidation_fees,
            0
        ) as liquidation_fees,
        COALESCE(
            ad.volume,
            0
        ) as volume,
        COALESCE(
            ad.amount_liquidated,
            0
        ) as amount_liquidated,
        COALESCE(
            ad.trades,
            0
        ) as trades,
        COALESCE(
            ad.liquidations,
            0
        ) as liquidations
    from
        date_series as ds
    left join aggregated_data as ad
        on
            ds.ts = ad.ts
            and ds.market = ad.market
),

agg_data as (
    select
        ts,
        market,
        FIRST_VALUE(long_oi_usd) over (
            partition by
                market,
                value_partition
            order by
                ts
        ) as long_oi_usd,
        FIRST_VALUE(short_oi_usd) over (
            partition by
                market,
                value_partition
            order by
                ts
        ) as short_oi_usd,
        FIRST_VALUE(total_oi_usd) over (
            partition by
                market,
                value_partition
            order by
                ts
        ) as total_oi_usd,
        FIRST_VALUE(cumulative_exchange_fees) over (
            partition by
                market,
                value_partition
            order by
                ts
        ) as cumulative_exchange_fees,
        FIRST_VALUE(cumulative_liquidation_fees) over (
            partition by
                market,
                value_partition
            order by
                ts
        ) as cumulative_liquidation_fees,
        FIRST_VALUE(cumulative_volume) over (
            partition by
                market,
                value_partition
            order by
                ts
        ) as cumulative_volume,
        FIRST_VALUE(cumulative_amount_liquidated) over (
            partition by
                market,
                value_partition
            order by
                ts
        ) as cumulative_amount_liquidated,
        FIRST_VALUE(cumulative_trades) over (
            partition by
                market,
                value_partition
            order by
                ts
        ) as cumulative_trades,
        FIRST_VALUE(cumulative_liquidations) over (
            partition by
                market,
                value_partition
            order by
                ts
        ) as cumulative_liquidations
    from
        (
            select
                ts,
                market,
                long_oi_usd,
                short_oi_usd,
                total_oi_usd,
                cumulative_exchange_fees,
                cumulative_liquidation_fees,
                cumulative_volume,
                cumulative_amount_liquidated,
                cumulative_trades,
                cumulative_liquidations,
                COUNT(long_oi_usd) over (
                    partition by market
                    order by
                        ts
                ) as value_partition
            from
                gap_data
        ) as q
)

select
    gap_data.ts,
    gap_data.market,
    gap_data.exchange_fees,
    gap_data.liquidation_fees,
    gap_data.volume,
    gap_data.amount_liquidated,
    gap_data.trades,
    gap_data.liquidations,
    agg_data.long_oi_usd,
    agg_data.short_oi_usd,
    agg_data.total_oi_usd,
    agg_data.cumulative_exchange_fees,
    agg_data.cumulative_liquidation_fees,
    agg_data.cumulative_volume,
    agg_data.cumulative_amount_liquidated,
    agg_data.cumulative_trades,
    agg_data.cumulative_liquidations
from
    gap_data
inner join
    agg_data
    on gap_data.ts = agg_data.ts and gap_data.market = agg_data.market
