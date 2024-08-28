with token_hourly as (
    select
        ts,
        pool_id,
        collateral_type,
        rewards_usd
    from
        {{ ref('fct_pool_rewards_token_hourly_base_sepolia') }}
)

select
    ts,
    pool_id,
    collateral_type,
    SUM(rewards_usd) as rewards_usd
from
    token_hourly
group by
    ts,
    pool_id,
    collateral_type
