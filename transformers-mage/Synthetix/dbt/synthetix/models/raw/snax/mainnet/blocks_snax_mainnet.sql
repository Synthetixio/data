select distinct
    "timestamp" as ts,
    CAST(
        "number" as INTEGER
    ) as block_number
from
    {{ source(
        'raw_snax_mainnet',
        'block'
    ) }}
