with indexer_blocks as (
    select
        timestamp as ts,
        CAST(
            number as INTEGER
        ) as block_number
    from
        {{ source(
            'raw_arbitrum_mainnet',
            'synthetix_block'
        ) }}
)


select
    block_number,
    MIN(ts) as ts
from
    indexer_blocks
group by
    block_number
