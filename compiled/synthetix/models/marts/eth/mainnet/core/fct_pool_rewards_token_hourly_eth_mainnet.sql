with dim as (
    select
        m.pool_id,
        m.collateral_type,
        generate_series(
            date_trunc('hour', min(t.ts)),
            date_trunc('hour', max(t.ts)),
            '1 hour'::INTERVAL
        ) as ts
    from
        (
            select ts
            from
                "analytics"."prod_eth_mainnet"."fct_pool_debt_eth_mainnet"
        ) as t
    cross join (
        select distinct
            pool_id,
            collateral_type
        from
            "analytics"."prod_eth_mainnet"."fct_pool_debt_eth_mainnet"
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
        "analytics"."prod_eth_mainnet"."fct_pool_rewards_eth_mainnet"
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
            d."duration" / 3600
        ) as hourly_amount,
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
                    d.ts + '1 hour'::INTERVAL - greatest(
                        d.ts,
                        d.ts_start
                    )
                )
            ) / 3600
        ) * d.amount / (
            d."duration" / 3600
        ) as amount_distributed
    from
        hourly_distributions as d
    left join
        "analytics"."prod_eth_mainnet"."fct_prices_hourly_eth_mainnet"
        as p
        on
            d.ts = p.ts
            and d.token_symbol = p.market_symbol
    where
        d.distributor_index = 1
)

select
    *,
    amount_distributed * price as rewards_usd
from
    hourly_rewards
where
    amount_distributed is not null