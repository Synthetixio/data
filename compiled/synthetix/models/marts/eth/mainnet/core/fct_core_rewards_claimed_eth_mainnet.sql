with rewards_claimed as (
    select
        block_timestamp as ts,
        CAST(
            pool_id as INTEGER
        ) as pool_id,
        account_id,
        collateral_type,
        distributor,
        
    amount / 1e18
 as amount
    from
        "analytics"."prod_raw_eth_mainnet"."core_rewards_claimed_eth_mainnet"
),

distributors as (
    select
        CAST(distributor_address as TEXT) as distributor_address,
        CAST(token_symbol as TEXT) as token_symbol,
        reward_type
    from
        "analytics"."prod_seeds"."eth_mainnet_reward_distributors"
),

hourly_prices as (
    select
        ts,
        market_symbol,
        price
    from
        "analytics"."prod_eth_mainnet"."fct_prices_hourly_eth_mainnet"
)

select
    rc.ts,
    rc.pool_id,
    rc.collateral_type,
    rc.account_id,
    distributors.reward_type,
    rc.distributor,
    distributors.token_symbol,
    rc.amount,
    hourly_prices.price,
    rc.amount * hourly_prices.price as amount_usd
from
    rewards_claimed as rc
inner join distributors on rc.distributor = distributors.distributor_address
inner join
    hourly_prices
    on
        DATE_TRUNC('hour', rc.ts) = hourly_prices.ts
        and distributors.token_symbol = hourly_prices.market_symbol
order by
    rc.ts