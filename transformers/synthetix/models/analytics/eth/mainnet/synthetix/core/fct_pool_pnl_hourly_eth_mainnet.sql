{{
    config(
        materialized = "table",
        unique_key = ['ts', 'pool_id', 'collateral_type'],
        engine = 'MergeTree',
        tags = ["analytics", "pool", "pnl", "eth", "mainnet"],
    )
}}

with dim as (
    select
        arrayJoin(
            arrayMap(
                x -> toDateTime(x),
                range(
                    toUInt32(date_trunc('hour', min(t.ts))),
                    toUInt32(date_trunc('hour', max(t.ts))),
                    3600
                )
            )
        ) as ts,
        p.pool_id as pool_id,
        p.collateral_type as collateral_type
    from
        (
            select ts
            from
                {{ ref('fct_pool_debt_eth_mainnet') }}
        ) as t
    cross join (
        select distinct
            pool_id,
            collateral_type
        from
            {{ ref('fct_pool_debt_eth_mainnet') }}
    ) as p
    group by
        pool_id,
        collateral_type
),

issuance as (
    select
        ts,
        pool_id,
        collateral_type,
        hourly_issuance
    from
        {{ ref('fct_pool_issuance_hourly_eth_mainnet') }}
),

debt as (
    select distinct
        pool_id,
        collateral_type,
        date_trunc(
            'hour',
            ts
        ) as debt_ts,
        last_value(debt) over (
            partition by debt_ts, pool_id, collateral_type
            order by
                ts
            rows between unbounded preceding
            and unbounded following
        ) as debt
    from
        {{ ref('fct_pool_debt_eth_mainnet') }}
),

collateral as (
    select distinct
        pool_id,
        collateral_type,
        date_trunc(
            'hour',
            ts
        ) as collateral_ts,
        last_value(collateral_value) over (
            partition by collateral_ts, pool_id, collateral_type
            order by
                ts
            rows between unbounded preceding
            and unbounded following
        ) as collateral_value
    from
        {{ ref('core_vault_collateral_eth_mainnet') }}
    where
        pool_id = 1
),

ffill as (
    select
        dim.ts as ts,
        dim.pool_id as pool_id,
        dim.collateral_type as collateral_type,
        coalesce(
            last_value(debt.debt) over (
                partition by dim.collateral_type, dim.pool_id
                order by dim.ts
                rows between unbounded preceding and current row
            ),
            0
        ) as debt,
        coalesce(
            last_value(collateral.collateral_value) over (
                partition by dim.collateral_type, dim.pool_id
                order by dim.ts
                rows between unbounded preceding and current row
            ),
            0
        ) as collateral_value
    from
        dim
    left join debt
        on
            dim.ts = debt.debt_ts
            and dim.pool_id = debt.pool_id
            and dim.collateral_type = debt.collateral_type
    left join collateral
        on
            dim.ts = collateral.collateral_ts
            and dim.pool_id = collateral.pool_id
            and dim.collateral_type = collateral.collateral_type
),

hourly_pnl as (
    select
        ts,
        pool_id,
        collateral_type,
        collateral_value,
        debt,
        coalesce(lagInFrame(debt) over (
            partition by pool_id, collateral_type
            order by
                ts
            rows between unbounded preceding and unbounded following
        ) - debt, 0) as hourly_pnl
    from
        ffill
),

hourly_rewards as (
    select
        ts,
        pool_id,
        collateral_type,
        rewards_usd
    from
        {{ ref('fct_pool_rewards_hourly_eth_mainnet') }}
),

hourly_migration as (
    select
        ts,
        pool_id,
        collateral_type,
        hourly_debt_migrated
    from
        {{ ref('fct_core_migration_hourly_eth_mainnet') }}
),

hourly_returns as (
    select
        pnl.ts as ts,
        pnl.pool_id as pool_id,
        pnl.collateral_type as collateral_type,
        pnl.collateral_value as collateral_value,
        pnl.debt as debt,
        coalesce(
            iss.hourly_issuance,
            0
        ) as hourly_issuance,
        coalesce(
            migration.hourly_debt_migrated,
            0
        ) as hourly_debt_migrated,
        pnl.hourly_pnl + coalesce(
            iss.hourly_issuance,
            0
        ) + coalesce(
            migration.hourly_debt_migrated,
            0
        ) as hourly_pnl,
        coalesce(
            rewards.rewards_usd,
            0
        ) as rewards_usd,
        case
            when pnl.collateral_value = 0 then 0
            else coalesce(
                rewards.rewards_usd,
                0
            ) / pnl.collateral_value
        end as hourly_rewards_pct,
        case
            when pnl.collateral_value = 0 then 0
            else (
                coalesce(iss.hourly_issuance, 0)
                + pnl.hourly_pnl
                + coalesce(migration.hourly_debt_migrated, 0)
            ) / pnl.collateral_value
        end as hourly_pnl_pct,
        case
            when pnl.collateral_value = 0 then 0
            else (
                coalesce(rewards.rewards_usd, 0)
                + pnl.hourly_pnl
                + coalesce(iss.hourly_issuance, 0)
                + coalesce(migration.hourly_debt_migrated, 0)
            ) / pnl.collateral_value
        end as hourly_total_pct
    from
        hourly_pnl as pnl
    left join hourly_rewards as rewards
        on
            pnl.ts = rewards.ts
            and pnl.pool_id = rewards.pool_id
            and pnl.collateral_type = rewards.collateral_type
    left join issuance as iss
        on
            pnl.ts = iss.ts
            and pnl.pool_id = iss.pool_id
            and lower(
                pnl.collateral_type
            ) = lower(
                iss.collateral_type
            )
    left join hourly_migration as migration
        on
            pnl.ts = migration.ts
            and pnl.pool_id = migration.pool_id
            and lower(
                pnl.collateral_type
            ) = lower(
                migration.collateral_type
            )
)

select
    ts,
    pool_id,
    collateral_type,
    collateral_value,
    debt,
    hourly_issuance,
    hourly_pnl,
    hourly_debt_migrated,
    rewards_usd,
    hourly_pnl_pct,
    hourly_rewards_pct,
    hourly_total_pct
from
    hourly_returns