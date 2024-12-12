with core_pool_created as (
    {{ get_event_data(
        'arbitrum',
        'mainnet',
        'synthetix',
        'core_proxy',
        'pool_created'
    ) }}
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    sender,
    owner,
    cast(pool_id as UInt128) as pool_id
from core_pool_created