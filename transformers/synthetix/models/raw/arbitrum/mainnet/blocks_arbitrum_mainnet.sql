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
{% if target.name != 'optimism_mainnet' %}
    parquet_blocks AS (
        SELECT
            TO_TIMESTAMP("timestamp") AS ts,
            CAST(
                "block_number" AS INTEGER
            ) AS block_number
        FROM
            {{ source(
                'raw_' ~ target.name,
                'blocks_parquet'
            ) }}
    ),
{% endif %}

combined_blocks AS (
    SELECT
        *
    FROM
        indexer_blocks

        {% if target.name != 'optimism_mainnet' %}
    UNION ALL
    SELECT
        *
    FROM
        parquet_blocks
    {% endif %}
)
SELECT
    DISTINCT MIN(ts) AS ts,
    block_number
FROM
    combined_blocks
GROUP BY
    block_number
