{{ config(
    materialized = 'table',
    unique_key = ['ts', 'pool_id', 'collateral_type', 'reward_token'],
) }}

with dim as (

    select
        t.pool_id,
        t.collateral_type,
        t.collateral_value,
        p.token_symbol as reward_token,
        generate_series(
            date_trunc('hour', min(t.ts)),
            date_trunc('hour', max(t.ts)),
            '1 hour'::INTERVAL
        ) as ts
    from
        (
            select
                ts,
                collateral_type,
                pool_id,
                collateral_value
            from
                {{ ref('fct_pool_pnl_hourly_arbitrum_sepolia') }}
            group by
                ts,
                collateral_type,
                pool_id,
                collateral_value
        ) as t
    cross join (
        select distinct token_symbol
        from
            {{ ref('fct_pool_rewards_token_hourly_arbitrum_sepolia') }}
    ) as p
    group by
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
        sum(
            rewards_usd
        ) as rewards_usd
    from
        {{ ref('fct_pool_rewards_token_hourly_arbitrum_sepolia') }}
    group by
        ts,
        pool_id,
        collateral_type,
        token_symbol
)

select
    dim.ts,
    dim.pool_id,
    dim.collateral_type,
    dim.collateral_value,
    dim.reward_token,
    coalesce(
        reward_hourly_token.rewards_usd,
        0
    ) as rewards_usd,
    case
        when dim.collateral_value = 0 then 0
        else coalesce(
            reward_hourly_token.rewards_usd,
            0
        ) / dim.collateral_value
    end as hourly_rewards_pct
from
    dim
left join reward_hourly_token
    on
        dim.ts = reward_hourly_token.ts
        and dim.pool_id = reward_hourly_token.pool_id
        and dim.collateral_type = reward_hourly_token.collateral_type
        and dim.reward_token = reward_hourly_token.reward_token
