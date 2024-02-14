SELECT
    id,
    "timestamp" AS ts,
    CAST(
        "number" AS INTEGER
    ) AS block_number
FROM
    {{ source(
        'raw_' ~ target.name,
        'block'
    ) }}
