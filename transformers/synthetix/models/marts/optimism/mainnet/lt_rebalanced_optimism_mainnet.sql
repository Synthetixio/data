select
    id,
    block_number,
    block_timestamp as ts,
    transaction_hash,
    contract,
    event_name,
    token,
    cast(
        regexp_replace(token, '.*_(long|short)', '') as int
    ) as leverage,
    {{ convert_wei('current_leverage') }} as current_leverage
from {{ ref('tlx_lt_rebalanced_optimism_mainnet') }}
