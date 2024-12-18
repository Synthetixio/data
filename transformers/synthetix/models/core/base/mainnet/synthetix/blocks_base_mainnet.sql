with indexer_blocks as (
    select
        timestamp as ts,
        CAST(
            number as INTEGER
        ) as block_number
    from
        {{ source(
            'raw_base_mainnet',
            'synthetix_block'
        ) }}
),

parquet_blocks as (
    select
        FROM_UNIXTIME(timestamp) as ts,
        CAST(
            block_number as INTEGER
        ) as block_number
    from
        {{ source(
            'raw_base_mainnet',
            'blocks_parquet'
        ) }}
),

combined_blocks as (
    select *
    from
        indexer_blocks

    union all
    select *
    from
        parquet_blocks
)

select
    block_number,
    MIN(ts) as ts
from
    combined_blocks
group by
    block_number
