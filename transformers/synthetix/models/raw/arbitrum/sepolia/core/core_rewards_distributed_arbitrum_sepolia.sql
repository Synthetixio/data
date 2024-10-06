with core_rewards_distributed as (
    {{ get_event_data(
        'arbitrum',
        'sepolia',
        'core_proxy',
        'rewards_distributed'
    ) }}
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    cast(pool_id as UInt128) as pool_id,
    collateral_type,
    distributor,
    cast(amount as UInt256) as amount,
    cast(start as UInt256) as start,
    cast(duration as UInt256) as duration
from core_rewards_distributed
