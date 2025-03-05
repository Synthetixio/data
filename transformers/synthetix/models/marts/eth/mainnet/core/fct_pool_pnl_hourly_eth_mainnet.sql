{{ config(
    materialized = 'table',
    unique_key = ['ts', 'pool_id', 'collateral_type'],
) }}

with dim as (
    select
        generate_series(
            date_trunc('hour', min(t.ts)),
            date_trunc('hour', max(t.ts)), '1 hour'::interval
        ) as ts,
        p.pool_id,
        p.collateral_type
    from
        (
            select distinct ts
            from
                {{ ref('fct_pool_debt_eth_mainnet') }}
        ) as t
    cross join (
        select distinct
            1 as pool_id,
            collateral_type
        from
            {{ ref('fct_pool_debt_eth_mainnet') }}
    ) as p
    group by
        p.pool_id,
        p.collateral_type
),

issuance as (
    select
        ts,
        1 as pool_id,
        collateral_type,
        sum(hourly_issuance) as hourly_issuance
    from
        {{ ref('fct_pool_issuance_hourly_eth_mainnet') }}
    group by 1, 2, 3
),

debt as (
    select distinct
        pool_id,
        collateral_type,
        date_trunc(
            'hour',
            ts
        ) as ts,
        last_value(debt) over (
            partition by date_trunc('hour', ts), pool_id, collateral_type
            order by
                ts
            rows between unbounded preceding
            and unbounded following
        ) as debt
    from
        {{ ref('fct_pool_debt_eth_mainnet') }}
),

artificial_debt as (
    select distinct
        date_trunc('hour', ts) as ts,
        last_value(artificial_debt) over (
            partition by date_trunc('hour', ts)
            order by ts
            rows between unbounded preceding
            and unbounded following
        ) as artificial_debt
    from {{ ref('treasury_artificial_debt_eth_mainnet') }}
),

debt_combined as (
    select
        1 as pool_id,
        collateral_type,
        ts,
        sum(debt) as debt
    from debt
    group by 1, 2, 3
),

debt_combined_without_artificial as (
    select
        pool_id,
        collateral_type,
        debt_combined.ts,
        debt - coalesce(art.artificial_debt, 0) as debt
    from debt_combined
    left join artificial_debt as art
        on debt_combined.ts = art.ts
),

collateral as (
    select distinct
        pool_id,
        collateral_type,
        date_trunc(
            'hour',
            ts
        ) as ts,
        last_value(collateral_value) over (
            partition by date_trunc('hour', ts), pool_id, collateral_type
            order by
                ts
            rows between unbounded preceding
            and unbounded following
        ) as collateral_value
    from
        {{ ref('core_vault_collateral_eth_mainnet') }}
),

collateral_combined as (
    select
        1 as pool_id,
        collateral_type,
        ts,
        sum(collateral_value) as collateral_value
    from collateral
    group by 1, 2, 3
),

ffill as (
    select
        dim.ts,
        dim.pool_id,
        dim.collateral_type,
        coalesce(
            last(debt.debt) over (
                partition by dim.collateral_type, dim.pool_id
                order by dim.ts
                rows between unbounded preceding and current row
            ),
            0
        ) as debt,
        coalesce(
            last(collateral.collateral_value) over (
                partition by dim.collateral_type, dim.pool_id
                order by dim.ts
                rows between unbounded preceding and current row
            ),
            0
        ) as collateral_value
    from
        dim
    left join debt_combined_without_artificial as debt
        on
            dim.ts = debt.ts
            and dim.pool_id = debt.pool_id
            and dim.collateral_type = debt.collateral_type
    left join collateral_combined as collateral
        on
            dim.ts = collateral.ts
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
        coalesce(lag(debt) over (
            partition by pool_id, collateral_type
            order by
                ts
        ) - debt, 0) as hourly_pnl
    from
        ffill
),

hourly_rewards as (
    select
        ts,
        pool_id,
        collateral_type,
        sum(rewards_usd) as rewards_usd
    from
        {{ ref('fct_pool_rewards_hourly_eth_mainnet') }}
    group by 1, 2, 3
),

hourly_migration as (
    select
        ts,
        pool_id,
        collateral_type,
        sum(hourly_debt_migrated) as hourly_debt_migrated
    from
        {{ ref('fct_core_migration_hourly_eth_mainnet') }}
    group by 1, 2, 3
),

hourly_returns as (
    select
        pnl.ts,
        pnl.pool_id,
        pnl.collateral_type,
        pnl.collateral_value,
        pnl.debt,
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
