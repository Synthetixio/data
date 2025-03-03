with base as (
    select
        pool_id as id,
        block_timestamp as created_ts,
        block_number,
        owner
    from
        {{ ref('core_pool_created_arbitrum_sepolia') }}
)

select *
from
    base
