with dim as (
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
                min(ts_start) as min_ts,
                max(
                    ts_start + "duration" * '1 second'::INTERVAL
                ) as max_ts
            from
                {{ ref('fct_pool_rewards_arbitrum_mainnet') }}
        ) as t
    cross join (
        select distinct
            pool_id,
            collateral_type
        from
            {{ ref('fct_pool_debt_arbitrum_mainnet') }}
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
        "duration"
    from
        {{ ref('fct_pool_rewards_arbitrum_mainnet') }}
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
        r."duration",
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
            and dim.ts + '1 hour'::INTERVAL >= r.ts_start
            and dim.ts < r.ts_start + r."duration" * '1 second'::INTERVAL
    where
        r."duration" > 0
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
            extract(
                epoch
                from
                least(
                    d."duration" / 3600 * '1 hour'::INTERVAL,
                    least(
                        d.ts + '1 hour'::INTERVAL - greatest(
                            d.ts,
                            d.ts_start
                        ),
                        least(
                            d.ts_start + d."duration" * '1 second'::INTERVAL,
                            d.ts + '1 hour'::INTERVAL
                        ) - d.ts
                    )
                )
            ) / 3600
        ) * d.amount / (
            d."duration" / 3600
        ) as amount
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
        r.pool_id,
        r.collateral_type,
        r.distributor,
        r.token_symbol,
        r.amount
    from
        rewards_distributed as r
    where
        r."duration" = 0
),

combined as (
    select
        combo.ts,
        combo.pool_id,
        combo.collateral_type,
        combo.distributor,
        combo.token_symbol,
        combo.amount,
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
    left join {{ ref('fct_prices_hourly_arbitrum_mainnet') }} as p
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
    sum(amount) as amount,
    sum(
        amount * price
    ) as rewards_usd
from
    combined
group by
    1,
    2,
    3,
    4,
    5
