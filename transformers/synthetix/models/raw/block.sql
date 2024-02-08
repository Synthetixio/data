SELECT
    id,
    "timestamp" AS ts,
    "number" AS block_number
FROM
    {{ source(
        'raw_' ~ target.name,
        'block'
    ) }}
