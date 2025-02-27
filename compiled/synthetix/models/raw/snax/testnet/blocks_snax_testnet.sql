select distinct
    "timestamp" as ts,
    CAST(
        "number" as INTEGER
    ) as block_number
from
    "analytics"."raw_snax_testnet"."block"