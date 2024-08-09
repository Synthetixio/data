WITH burns AS (
    SELECT
        block_timestamp AS ts,
        block_number,
        transaction_hash,
        pool_id,
        collateral_type,
        account_id,
        -1 * 
    amount / 1e18
 AS amount
    FROM
        "analytics"."prod_raw_arbitrum_mainnet"."core_usd_burned_arbitrum_mainnet"
    ORDER BY
        block_timestamp DESC
),
mints AS (
    SELECT
        block_timestamp AS ts,
        block_number,
        transaction_hash,
        pool_id,
        collateral_type,
        account_id,
        
    amount / 1e18
 AS amount
    FROM
        "analytics"."prod_raw_arbitrum_mainnet"."core_usd_minted_arbitrum_mainnet"
    ORDER BY
        block_timestamp DESC
)
SELECT
    *
FROM
    burns
UNION ALL
SELECT
    *
FROM
    mints
ORDER BY
    ts DESC