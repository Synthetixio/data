with base as (
    select
        pool_id as id,
        block_timestamp as created_ts,
        block_number,
        owner
    from
        "analytics"."prod_raw_arbitrum_mainnet"."core_pool_created_arbitrum_mainnet"
)

select *
from
    base