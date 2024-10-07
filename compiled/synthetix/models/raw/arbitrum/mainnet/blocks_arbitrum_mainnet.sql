with indexer_blocks as (
    select
        timestamp as ts,
        CAST(
            number as INTEGER
        ) as block_number
    from
        "analytics"."raw_arbitrum_mainnet"."block"
),

parquet_blocks as (
    select
        TO_TIMESTAMP(timestamp) as ts,
        CAST(
            block_number as INTEGER
        ) as block_number
    from
        "analytics"."raw_arbitrum_mainnet"."blocks_parquet"
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