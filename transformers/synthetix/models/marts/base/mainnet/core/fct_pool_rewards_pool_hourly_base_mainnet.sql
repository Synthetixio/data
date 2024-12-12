with dim_collateral as (
    select
        m.pool_id,
        m.collateral_type,
        generate_series(
            date_trunc('hour', min(t.min_ts)),
            date_trunc('hour', max(t.max_ts)),
            '1 hour'::INTERVAL
        ) as ts
    from
        (
            select
                min(r.ts_start) as min_ts,
                max(
                    r.ts_start + r.duration * '1 second'::INTERVAL
                ) as max_ts
            from
                {{ ref('fct_pool_rewards_base_mainnet') }}
        ) as t
    cross join (
        select distinct
            m.pool_id,
            m.collateral_type
        from
            {{ ref('fct_pool_debt_base_mainnet') }} as m
    ) as m
    group by
        m.pool_id,
        m.collateral_type
),

dim_pool as (
    select distinct
        ts,
        pool_id
    from
        dim_collateral
),

rewards_distributed as (
    select
        ts,
        pool_id,
        distributor,
        token_symbol,
        amount,
        ts_start,
        duration
    from
        {{ ref('fct_pool_rewards_base_mainnet') }}
    where
        collateral_type = '0x0000000000000000000000000000000000000000'
),

hourly_distributions as (
    select
        dim.ts,
        dim.pool_id,
        r.distributor,
        r.token_symbol,
        r.amount,
        r.ts_start,
        r.duration,
        row_number() over (
            partition by
                dim.ts,
                dim.pool_id,
                r.distributor
            order by
                r.ts_start desc
        ) as distributor_index
    from
        dim_pool as dim
    left join rewards_distributed as r
        on
            dim.pool_id = r.pool_id
            and dim.ts + '1 hour'::INTERVAL >= r.ts_start
            and dim.ts < r.ts_start + r.duration * '1 second'::INTERVAL
    where
        r.duration > 0
),

streamed_rewards as (
    select
        d.ts,
        d.pool_id,
        d.distributor,
        d.token_symbol,
        -- get the amount of time distributed this hour
        -- use the smaller of those two intervals
        -- convert the interval to a number of hours
        -- multiply the result by the hourly amount to
        -- get the amount distributed this hour
        (
            extract(
                epoch
                from
                least(
                    d.duration / 3600 * '1 hour'::INTERVAL,
                    least(
                        d.ts + '1 hour'::INTERVAL - greatest(
                            d.ts,
                            d.ts_start
                        ),
                        least(
                            d.ts_start + d.duration * '1 second'::INTERVAL,
                            d.ts + '1 hour'::INTERVAL
                        ) - d.ts
                    )
                )
            ) / 3600
        ) * d.amount / (
            d.duration / 3600
        ) as amount
    from
        hourly_distributions as d
    where
        d.distributor_index = 1
),

combined as (
    select
        r.ts,
        r.pool_id,
        r.distributor,
        r.token_symbol,
        r.amount,
        p.price
    from
        streamed_rewards as r
    left join {{ ref('fct_prices_hourly_base_mainnet') }} as p
        on
            r.token_symbol = p.market_symbol
            and r.ts = p.ts
)

select
    ts,
    pool_id,
    token_symbol,
    sum(amount) as amount,
    sum(
        amount * price
    ) as rewards_usd
from
    combined
group by
    ts,
    pool_id,
    token_symbol
