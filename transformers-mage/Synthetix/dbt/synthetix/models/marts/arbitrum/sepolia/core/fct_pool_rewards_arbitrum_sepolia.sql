with rewards_distributed as (
    select
        block_timestamp as ts,
        CAST(
            pool_id as INTEGER
        ) as pool_id,
        collateral_type,
        distributor,
        {{ convert_wei('amount') }} as amount,
        TO_TIMESTAMP("start") as ts_start,
        "duration"
    from
        {{ ref('core_rewards_distributed_arbitrum_sepolia') }}
),

distributors as (
    select
        CAST(distributor_address as TEXT) as distributor_address,
        CAST(token_symbol as TEXT) as token_symbol
    from
        {{ ref('arbitrum_sepolia_reward_distributors') }}
)

select
    rd.ts,
    rd.pool_id,
    rd.collateral_type,
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
