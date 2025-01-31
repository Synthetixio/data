{{
    config(
        materialized = 'view',
        tags = ["analytics", "pools", "eth", "mainnet"],
    )
}}

with base as (
    select
        pool_id as id,
        block_timestamp as created_ts,
        block_number,
        owner
    from
        {{ ref('core_pool_created_eth_mainnet') }}
)

select
    id,
    created_ts as ts,
    block_number,
    owner
from
    base