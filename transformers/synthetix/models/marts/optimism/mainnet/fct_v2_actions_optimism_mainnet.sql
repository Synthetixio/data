WITH combined_base AS (
    SELECT
        *
    FROM
        {{ ref('fct_v2_trades_optimism_mainnet_optimism_mainnet') }}
    UNION ALL
    SELECT
        *
    FROM
        {{ ref('fct_v2_liquidations_optimism_mainnet_optimism_mainnet') }}
),
all_base AS (
    SELECT
        id,
        ts,
        block_number,
        transaction_hash,
        price,
        account,
        market,
        margin,
        trade_size,
        "size",
        last_size,
        skew,
        fee,
        order_type,
        tracking_code
    FROM
        combined_base
)
SELECT
    *
FROM
    all_base
