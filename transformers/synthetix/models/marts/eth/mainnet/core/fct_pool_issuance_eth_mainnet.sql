WITH burns AS (
    SELECT
        block_timestamp AS ts,
        block_number,
        transaction_hash,
        pool_id,
        collateral_type,
        account_id,
        -1 * {{ convert_wei('amount') }} AS amount
    FROM
        {{ ref('core_usd_burned_eth_mainnet') }}
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
        {{ convert_wei('amount') }} AS amount
    FROM
        {{ ref('core_usd_minted_eth_mainnet') }}
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
