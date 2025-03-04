with rewards_distributed as (
    select
        block_timestamp as ts,
        CAST(
            pool_id as INTEGER
        ) as pool_id,
        collateral_type,
        distributor,
        
    amount / 1e18
 as amount,
        TO_TIMESTAMP(start) as ts_start,
        duration
    from
        "analytics"."prod_raw_base_mainnet"."core_rewards_distributed_base_mainnet"
),

distributors as (
    select
        CAST(distributor_address as TEXT) as distributor_address,
        CAST(token_symbol as TEXT) as token_symbol,
        reward_type
    from
        "analytics"."prod_seeds"."base_mainnet_reward_distributors"
)

select
    rd.ts,
    rd.pool_id,
    rd.collateral_type,
    distributors.reward_type,
    rd.distributor,
    distributors.token_symbol,
    rd.amount,
    rd.ts_start,
    rd.duration
from
    rewards_distributed as rd
inner join distributors on rd.distributor = distributors.distributor_address
order by
    ts