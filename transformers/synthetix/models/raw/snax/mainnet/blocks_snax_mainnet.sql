SELECT
    DISTINCT "timestamp" AS ts,
    CAST(
        "number" AS INTEGER
    ) AS block_number
FROM
    {{ source(
        'raw_snax_mainnet',
        'block'
    ) }}
