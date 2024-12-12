{{ config(
    materialized = 'table',
    unique_key = ['ts', 'pool_id', 'collateral_type', 'reward_token'],
) }}

with dim as (

    select
        t.ts,
        t.pool_id,
        t.collateral_type,
        t.collateral_value,
        p.token_symbol as reward_token
    from
        (
            select
                ts,
                collateral_type,
                pool_id,
                collateral_value
            from
                {{ ref('fct_pool_pnl_hourly_base_mainnet') }}
            group by
                ts,
                collateral_type,
                pool_id,
                collateral_value
        ) as t
    cross join (
        select distinct token_symbol
        from
            (
                select token_symbol
                from {{ ref('fct_pool_rewards_token_hourly_base_mainnet') }}
                union all
                select token_symbol
                from {{ ref('fct_pool_rewards_pool_hourly_base_mainnet') }}
            ) as tokens
    ) as p
    group by
        t.ts,
        t.pool_id,
        t.collateral_type,
        t.collateral_value,
        p.token_symbol
),

reward_hourly_token as (
    select
        ts,
        pool_id,
        collateral_type,
        token_symbol as reward_token,
        SUM(
            rewards_usd
        ) as rewards_usd
    from
        {{ ref('fct_pool_rewards_token_hourly_base_mainnet') }}
    group by
        ts,
        pool_id,
        collateral_type,
        token_symbol
),

reward_hourly_pool as (
    select
        dim.ts,
        dim.pool_id,
        dim.collateral_type,
        dim.reward_token,
        dim.collateral_value,
        SUM(
            dim.collateral_value
        ) over (
            partition by
                dim.ts,
                dim.pool_id,
                dim.reward_token
        ) as pool_collateral_value,
        dim.collateral_value / SUM(
            dim.collateral_value
        ) over (
            partition by
                dim.ts,
                dim.pool_id,
                dim.reward_token
        ) as collateral_type_share,
        r.rewards_usd as pool_rewards,
        r.rewards_usd
        * (
            dim.collateral_value
            / SUM(dim.collateral_value)
                over (partition by dim.ts, dim.pool_id, dim.reward_token)
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
    inner join dim
        on
            r.ts = dim.ts
            and r.pool_id = dim.pool_id
            and r.token_symbol = dim.reward_token
),


reward_hourly as (
    select
        ts,
        pool_id,
        collateral_type,
        reward_token,
        SUM(rewards_usd) as rewards_usd
    from
        (
            select
                ts,
                pool_id,
                collateral_type,
                reward_token,
                rewards_usd
            from reward_hourly_token
            union all
            select
                ts,
                pool_id,
                collateral_type,
                reward_token,
                rewards_usd
            from reward_hourly_pool
        ) as all_rewards
    group by ts, pool_id, collateral_type, reward_token
)

select
    dim.ts,
    dim.pool_id,
    dim.collateral_type,
    dim.collateral_value,
    dim.reward_token,
    COALESCE(
        reward_hourly.rewards_usd,
        0
    ) as rewards_usd,
    case
        when dim.collateral_value = 0 then 0
        else COALESCE(
            reward_hourly.rewards_usd,
            0
        ) / dim.collateral_value
    end as hourly_rewards_pct
from
    dim
left join reward_hourly
    on
        dim.ts = reward_hourly.ts
        and dim.pool_id = reward_hourly.pool_id
        and LOWER(dim.collateral_type)
        = LOWER(reward_hourly.collateral_type)
        and dim.reward_token = reward_hourly.reward_token
