{{
    config(
        materialized = "view",
        tags = ["analytics", "pool", "pnl", "base", "mainnet"],
    )
}}

with dim as (
    select
        p.pool_id as pool_id,
        p.collateral_type as collateral_type,
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
                {{ ref('fct_pool_debt_base_mainnet') }}
        ) as t
    cross join (
        select distinct
            pool_id,
            collateral_type
        from
            {{ ref('fct_pool_debt_base_mainnet') }}
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
        {{ ref('fct_pool_issuance_hourly_base_mainnet') }}
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
        {{ ref('fct_pool_debt_base_mainnet') }}
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
        {{ ref('core_vault_collateral_base_mainnet') }}
    where
        pool_id = 1
),

ffill as (
    select
        dim.ts as ts,
        dim.pool_id as pool_id,
        dim.collateral_type as collateral_type,
        coalesce(last_value(debt.debt) over (
            partition by dim.collateral_type, dim.pool_id
            order by
                dim.ts
            rows between unbounded preceding
            and current row
        ), 0) as debt,
        coalesce(last_value(collateral.collateral_value) over (
            partition by dim.collateral_type, dim.pool_id
            order by
                dim.ts
            rows between unbounded preceding
            and current row
        ), 0) as collateral_value
    from
        dim
    left join debt
        on
            dim.ts = debt.ts
            and dim.pool_id = debt.pool_id
            and dim.collateral_type = debt.collateral_type
    left join collateral
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
        coalesce(lagInFrame(debt) over (
            partition by pool_id, collateral_type
            order by
                ts
            rows between unbounded preceding and unbounded following
        ) - debt, 0) as hourly_pnl
    from
        ffill
),

pool_rewards as (
    select
        r.ts as ts,
        r.pool_id as pool_id,
        r.token_symbol as token_symbol,
        pnl.collateral_type as collateral_type,
        pnl.collateral_value as collateral_value,
        sum(
            pnl.collateral_value
        ) over (
            partition by
                r.ts,
                r.pool_id, r.token_symbol
        ) as pool_collateral_value,
        pnl.collateral_value / sum(
            pnl.collateral_value
        ) over (
            partition by
                r.ts,
                r.pool_id, r.token_symbol
        ) as collateral_type_share,
        r.rewards_usd as pool_rewards,
        -- reward share of pool rewards
        r.rewards_usd
        * (
            pnl.collateral_value
            / sum(pnl.collateral_value)
                over (partition by r.ts, r.pool_id, r.token_symbol)
        ) as rewards_usd
    from
        (
            select
                r.ts,
                r.pool_id,
                r.token_symbol,
                r.rewards_usd
            from
                {{ ref('fct_pool_rewards_pool_hourly_base_mainnet') }} as r
        ) as r
    inner join hourly_pnl as pnl
        on
            r.ts = pnl.ts
            and r.pool_id = pnl.pool_id
),

hourly_rewards as (
    select
        ts,
        pool_id,
        lower(collateral_type) as collateral_type,
        sum(rewards_usd) as rewards_usd
    from
        (
            select
                ts,
                pool_id,
                collateral_type,
                rewards_usd
            from {{ ref('fct_pool_rewards_token_hourly_base_mainnet') }}
            union all
            select
                ts,
                pool_id,
                collateral_type,
                rewards_usd
            from pool_rewards
        ) as all_rewards
    group by ts, pool_id, collateral_type
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
        pnl.hourly_pnl + coalesce(
            iss.hourly_issuance,
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
            else
                (coalesce(iss.hourly_issuance, 0) + pnl.hourly_pnl)
                / pnl.collateral_value
        end as hourly_pnl_pct,
        case
            when pnl.collateral_value = 0 then 0
            else (
                coalesce(
                    rewards.rewards_usd,
                    0
                ) + pnl.hourly_pnl + coalesce(
                    iss.hourly_issuance,
                    0
                )
            ) / pnl.collateral_value
        end as hourly_total_pct
    from
        hourly_pnl as pnl
    left join hourly_rewards as rewards
        on
            pnl.ts = rewards.ts
            and pnl.pool_id = rewards.pool_id
            and lower(
                pnl.collateral_type
            ) = lower(
                rewards.collateral_type
            )
    left join issuance as iss
        on
            pnl.ts = iss.ts
            and pnl.pool_id = iss.pool_id
            and lower(
                pnl.collateral_type
            ) = lower(
                iss.collateral_type
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
    rewards_usd,
    hourly_pnl_pct,
    hourly_rewards_pct,
    hourly_total_pct
from
    hourly_returns
