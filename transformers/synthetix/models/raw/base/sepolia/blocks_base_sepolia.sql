with indexer_blocks as (
    select
        timestamp as ts,
        CAST(
            number as INTEGER
        ) as block_number
    from
        {{ source(
            'raw_base_sepolia',
            'block'
        ) }}
),

parquet_blocks as (
    select
        TO_TIMESTAMP(timestamp) as ts,
        CAST(
            block_number as INTEGER
        ) as block_number
    from
        {{ source(
            'raw_base_sepolia',
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
