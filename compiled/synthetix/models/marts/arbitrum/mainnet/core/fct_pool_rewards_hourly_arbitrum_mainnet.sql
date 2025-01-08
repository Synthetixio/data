with token_hourly as (
    select
        ts,
        pool_id,
        collateral_type,
        rewards_usd
    from
        "analytics"."prod_arbitrum_mainnet"."fct_pool_rewards_token_hourly_arbitrum_mainnet"
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