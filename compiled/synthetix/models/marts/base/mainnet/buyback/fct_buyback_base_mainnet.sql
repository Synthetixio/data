SELECT
    id,
    block_timestamp AS ts,
    buyer,
    
    snx / 1e18
 AS snx,
    
    usd / 1e18
 AS usd,
    (
    usd / 1e18
) / (
    snx / 1e18
) AS snx_price
FROM
    "analytics"."prod_raw_base_mainnet"."buyback_processed_base_mainnet"