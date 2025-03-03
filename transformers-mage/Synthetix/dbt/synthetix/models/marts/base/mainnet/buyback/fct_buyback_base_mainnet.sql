select
    id,
    block_timestamp as ts,
    buyer,
    {{ convert_wei('snx') }} as snx,
    {{ convert_wei('usd') }} as usd,
    ({{ convert_wei('usd') }}) / ({{ convert_wei('snx') }}) as snx_price
from
    {{ ref('buyback_processed_base_mainnet') }}
