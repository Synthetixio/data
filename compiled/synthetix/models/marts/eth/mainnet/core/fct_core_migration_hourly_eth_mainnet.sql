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

migration as (
    select
        date_trunc(
            'hour',
            ts
        ) as ts,
        pool_id,
        collateral_type,
        sum(debt_amount) as hourly_debt_migrated
    from
        "analytics"."prod_eth_mainnet"."fct_core_migration_eth_mainnet"
    group by
        date_trunc('hour', ts),
        pool_id,
        collateral_type
)

select
    dim.ts,
    dim.pool_id,
    dim.collateral_type,
    coalesce(
        m.hourly_debt_migrated,
        0
    ) as hourly_debt_migrated
from
    dim
left join migration as m
    on
        dim.pool_id = m.pool_id
        and lower(
            dim.collateral_type
        ) = lower(
            m.collateral_type
        )
        and dim.ts = m.ts