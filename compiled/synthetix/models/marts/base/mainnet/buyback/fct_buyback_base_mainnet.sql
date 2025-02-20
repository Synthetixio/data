select
    id,
    block_timestamp as ts,
    buyer,
    
    snx / 1e18
 as snx,
    
    usd / 1e18
 as usd,
    (
    usd / 1e18
) / (
    snx / 1e18
) as snx_price
from
    "analytics"."prod_raw_base_mainnet"."buyback_processed_base_mainnet"