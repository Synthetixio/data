WITH indexer_blocks AS (
    SELECT
        "timestamp" AS ts,
        CAST(
            "number" AS INTEGER
        ) AS block_number
    FROM
        {{ source(
            'raw_' ~ target.name,
            'block'
        ) }}
),
parquet_blocks AS (
    SELECT
        TO_TIMESTAMP("timestamp") AT TIME ZONE 'UTC' AS ts,
        CAST(
            "block_number" AS INTEGER
        ) AS block_number
    FROM
        {{ source(
            'raw_' ~ target.name,
            'blocks_parquet'
        ) }}
),
combined_blocks AS (
    SELECT
        *
    FROM
        indexer_blocks
    UNION ALL
    SELECT
        *
    FROM
        parquet_blocks
)
SELECT
    DISTINCT MIN(ts) AS ts,
    block_number
FROM
    combined_blocks
GROUP BY
    block_number
