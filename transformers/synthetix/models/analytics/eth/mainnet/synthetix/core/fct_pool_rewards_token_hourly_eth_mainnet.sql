{{
    config(
        materialized = "view",
        tags = ["analytics", "pool", "rewards", "token", "eth", "mainnet"],
    )
}}

with dim as (
    select
        m.pool_id,
        m.collateral_type,
        arrayJoin(
            arrayMap(
                x -> toDateTime(x),
                range(
                    toUInt32(date_trunc('hour', min(t.tss))),
                    toUInt32(date_trunc('hour', max(t.tss))),
                    3600
                )
            )
        ) as ts
    from
        (
            select ts as tss
            from
                {{ ref('fct_pool_debt_eth_mainnet') }}
        ) as t
    cross join (
        select distinct
            pool_id,
            collateral_type
        from
            {{ ref('fct_pool_debt_eth_mainnet') }}
    ) as m
    group by
        pool_id,
        collateral_type
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
        duration
    from
        {{ ref('fct_pool_rewards_eth_mainnet') }}
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
            and dim.ts < r.ts_start + toIntervalSecond(r.duration)
),

hourly_rewards as (
    select
        d.ts,
        d.pool_id,
        d.collateral_type,
        d.distributor,
        d.token_symbol,
        p.price,
        -- get the hourly amount distributed
        d.amount / (
            d.duration / 3600
        ) as hourly_amount,
        -- get the amount of time distributed this hour
        -- use the smaller of those two intervals
        -- convert the interval to a number of hours
        -- multiply the result by the hourly amount to get the amount distributed this hour
        (
            toFloat64(
                least(
                    toInt32(d.duration),
                    d.ts + toIntervalHour(1) - greatest(
                        d.ts,
                        d.ts_start
                    )
                )
            )
        ) * d.amount / d.duration 
        as amount_distributed
    from
        hourly_distributions as d
    left join
        {{ ref('fct_prices_hourly_eth_mainnet') }}
        as p
        on
            d.ts = p.ts
            and d.token_symbol = p.market_symbol
    where
        d.distributor_index = 1
)

select
    ts,
    pool_id,
    collateral_type,
    distributor,
    token_symbol,
    price,
    hourly_amount,
    amount_distributed,
    amount_distributed * price as rewards_usd
from
    hourly_rewards
where
    amount_distributed is not null