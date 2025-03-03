with base as (
    select
        pool_id as id,
        block_timestamp as created_ts,
        block_number,
        owner
    from
        {{ ref('core_pool_created_eth_mainnet') }}
)

select *
from
    base
