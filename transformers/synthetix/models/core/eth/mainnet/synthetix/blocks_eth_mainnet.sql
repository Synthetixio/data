{{
    config(
        materialized = 'view',
    )
}}

with blocks as (
    select
        timestamp as ts,
        cast(number as Int64) as block_number
    from
        {{ source(
            'raw_eth_mainnet',
            'synthetix_block'
        ) }}
)

select
    block_number,
    MIN(ts) as ts
from
    blocks
group by
    block_number
