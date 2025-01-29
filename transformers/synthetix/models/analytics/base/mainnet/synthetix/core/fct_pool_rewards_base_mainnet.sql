{{
    config(
        materialized = "view",
        tags = ["analytics", "pool", "rewards", "base", "mainnet"],
    )
}}

with rewards_distributed as (
    select
        block_timestamp as ts,
        pool_id,
        collateral_type,
        distributor,
        {{ convert_wei('amount') }} as amount,
        FROM_UNIXTIME(start) as ts_start,
        duration
    from
        {{ ref('core_rewards_distributed_base_mainnet') }}
),

distributors as (
    select
        LOWER(CAST(distributor_address as TEXT)) as distributor_address,
        CAST(token_symbol as TEXT) as token_symbol
    from
        {{ ref('base_mainnet_reward_distributors') }}
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
