with dim as (
    select
        m.pool_id,
        m.collateral_type,
        arrayJoin(
            arrayMap(
                x -> toDateTime(x),
                range(
                    toUInt32(date_trunc('hour', min(t.min_ts))),
                    toUInt32(date_trunc('hour', max(t.max_ts))),
                    3600
                )
            )
        ) as ts
    from
        (
            select
                min(ts_start) as min_ts,
                max(
                    ts_start + toIntervalSecond(cast("duration" as UInt256))
                ) as max_ts
            from
                {{ ref('fct_pool_rewards_arbitrum_sepolia') }}
        ) as t
    cross join (
        select distinct
            pool_id,
            collateral_type
        from
            {{ ref('fct_pool_debt_arbitrum_sepolia') }}
    ) as m
    group by
        m.pool_id,
        m.collateral_type
),

rewards_distributed as (
    select
        ts,
        pool_id,
        collateral_type,
        distributor,
        token_symbol,
        amount,
        ts_start,
        cast("duration" as UInt256) as duration
    from
        {{ ref('fct_pool_rewards_arbitrum_sepolia') }}
),

hourly_distributions as (
    select
        dim.ts,
        dim.pool_id,
        dim.collateral_type,
        r.distributor,
        r.token_symbol,
        r.amount,
        r.ts_start,
        r.duration,
        row_number() over (
            partition by
                dim.ts,
                dim.pool_id,
                dim.collateral_type,
                r.distributor
            order by
                r.ts_start desc
        ) as distributor_index
    from
        dim
    left join rewards_distributed as r
        on
            dim.pool_id = r.pool_id
            and lower(
                dim.collateral_type
            ) = lower(
                r.collateral_type
            )
            and dim.ts + toIntervalHour(1) >= r.ts_start
            and dim.ts < r.ts_start + toIntervalSecond(cast(r.duration as UInt256)) 
    where
        r.duration > 0
),

streamed_rewards as (
    select
        d.ts,
        d.pool_id,
        d.collateral_type,
        d.distributor,
        d.token_symbol,
        -- get the amount of time distributed this hour
        -- use the smaller of those two intervals
        -- convert the interval to a number of hours
        -- multiply the result by the hourly amount to get the amount distributed this hour
        (
            toFloat64(
                least(
                    d.duration / 3600,
                    least(
                        d.ts + toIntervalHour(1) - greatest(
                            d.ts,
                            d.ts_start
                        ),
                        least(
                            d.ts_start + toIntervalSecond(d.duration),
                            d.ts + toIntervalHour(1)
                        ) - d.ts
                    )
                )
            ) 
         * d.amount) / d.duration as amount
    from
        hourly_distributions as d
    where
        d.distributor_index = 1
),

instant_rewards as (
    select
        date_trunc(
            'hour',
            ts
        ) as ts,
        pool_id,
        collateral_type,
        distributor,
        token_symbol,
        amount
    from
        rewards_distributed
    where
        duration = 0
),

combined as (
    select
        combo.ts,
        combo.pool_id,
        combo.collateral_type,
        combo.distributor,
        combo.token_symbol,
        combo.amount as amount_x,
        p.price
    from
        (
            select
                ts,
                pool_id,
                collateral_type,
                distributor,
                token_symbol,
                amount
            from
                streamed_rewards
            union all
            select
                ts,
                pool_id,
                collateral_type,
                distributor,
                token_symbol,
                amount
            from
                instant_rewards
        ) as combo
    left join {{ ref('fct_prices_hourly_arbitrum_sepolia') }} as p
        on
            combo.token_symbol = p.market_symbol
            and combo.ts = p.ts
)

select
    ts,
    pool_id,
    collateral_type,
    distributor,
    token_symbol,
    sum(amount_x) as amount,
    sum(
        amount_x * price
    ) as rewards_usd
from
    combined
group by
    ts,
    pool_id,
    collateral_type,
    distributor,
    token_symbol
settings allow_experimental_join_condition = 1