with aggregated_data as (
    select
        DATE_TRUNC(
            'day',
            ts
        ) as ts,
        tracking_code,
        SUM(exchange_fees) as exchange_fees,
        SUM(volume) as volume,
        SUM(trades) as trades
    from
        {{ ref('fct_v2_market_stats_optimism_mainnet') }}
    group by
        1,
        2
),

date_series as (
    select
        q.ts,
        q2.tracking_code
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
        select distinct tracking_code
        from
            aggregated_data
    ) as q2
),

traders as (
    select
        ds.ts,
        ds.tracking_code,
        COALESCE(COUNT(distinct account), 0) as traders
    from
        date_series as ds
    left join
        {{ ref('fct_v2_actions_optimism_mainnet') }}
        as ad
        on ds.ts = DATE_TRUNC(
            'day',
            ad.ts
        )
        and ds.tracking_code = ad.tracking_code
    group by
        1,
        2
),

complete_data as (
    select
        ds.ts,
        ds.tracking_code,
        t.traders,
        COALESCE(
            ad.exchange_fees,
            0
        ) as exchange_fees,
        COALESCE(
            ad.volume,
            0
        ) as volume,
        COALESCE(
            ad.trades,
            0
        ) as trades
    from
        date_series as ds
    left join aggregated_data as ad
        on
            ds.ts = ad.ts
            and ds.tracking_code = ad.tracking_code
    left join traders as t
        on
            ds.ts = t.ts
            and ds.tracking_code = t.tracking_code
),

total as (
    select
        ts,
        SUM(exchange_fees) as exchange_fees_total,
        SUM(trades) as trades_total,
        SUM(volume) as volume_total
    from
        complete_data
    group by
        1
)

select
    complete_data.ts,
    tracking_code,
    exchange_fees,
    exchange_fees_total,
    volume,
    volume_total,
    trades,
    trades_total,
    traders,
    case
        when volume_total = 0 then 0
        else complete_data.volume / volume_total
    end as volume_share,
    case
        when trades_total = 0 then 0
        else trades / trades_total
    end as trades_share,
    case
        when exchange_fees_total = 0 then 0
        else exchange_fees / exchange_fees_total
    end as exchange_fees_share,
    SUM(exchange_fees) over (
        partition by tracking_code
        order by
            complete_data.ts
    ) as cumulative_exchange_fees,
    SUM(volume) over (
        partition by tracking_code
        order by
            complete_data.ts
    ) as cumulative_volume,
    SUM(trades) over (
        partition by tracking_code
        order by
            complete_data.ts
    ) as cumulative_trades
from
    complete_data
inner join total
    on complete_data.ts = total.ts
