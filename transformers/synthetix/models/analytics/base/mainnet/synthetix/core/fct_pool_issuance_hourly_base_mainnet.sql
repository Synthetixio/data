{{
    config(
        materialized = "view",
        tags = ["analytics", "pool", "issuance", "base", "mainnet"],
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
                    toUInt32(date_trunc('hour', min(t.ts))),
                    toUInt32(date_trunc('hour', max(t.ts))),
                    3600
                )
            )
        ) as ts
    from
        (
            select ts
            from
                {{ ref('fct_pool_issuance_base_mainnet') }}
        ) as t
    cross join (
        select distinct
            pool_id,
            collateral_type
        from
            {{ ref('fct_pool_issuance_base_mainnet') }}
    ) as m
    group by
        m.pool_id,
        m.collateral_type
),

max_debt_block as (
    select
        pool_id,
        collateral_type,
        date_trunc(
            'hour',
            ts
        ) as tss,
        max(block_number) as max_block_number
    from
        {{ ref('fct_pool_debt_base_mainnet') }}
    group by
        tss,
        pool_id,
        collateral_type
),

filt_issuance as (
    select
        i.pool_id,
        i.collateral_type,
        i.amount,
        case
            when
                i.block_number <= d.max_block_number
                or d.max_block_number = 0 then i.ts
            else i.ts + toIntervalHour(1)
        end as ts
    from
        {{ ref('fct_pool_issuance_base_mainnet') }}
        as i
    left join max_debt_block as d
        on date_trunc(
            'hour',
            i.ts
        ) = d.tss
        and i.pool_id = d.pool_id
        and lower(
            i.collateral_type
        ) = lower(
            d.collateral_type
        )
    where
        i.block_number <= (
            select
                max(
                    max_block_number
                ) as b
            from
                max_debt_block
        )
),

issuance as (
    select
        date_trunc(
            'hour',
            ts
        ) as iss_ts,
        pool_id,
        collateral_type,
        sum(amount) as hourly_issuance
    from
        filt_issuance
    group by
        iss_ts,
        pool_id,
        collateral_type
)

select
    dim.ts,
    dim.pool_id,
    dim.collateral_type,
    coalesce(
        i.hourly_issuance,
        0
    ) as hourly_issuance
from
    dim
left join issuance as i
    on
        dim.pool_id = i.pool_id
        and lower(
            dim.collateral_type
        ) = lower(
            i.collateral_type
        )
        and dim.ts = i.iss_ts
