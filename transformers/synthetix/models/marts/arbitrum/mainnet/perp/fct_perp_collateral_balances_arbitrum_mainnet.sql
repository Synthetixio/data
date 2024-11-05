WITH synths AS (
    SELECT
        synth_market_id AS collateral_id,
        synth_token_address
    FROM
        {{ ref('spot_synth_registered_arbitrum_mainnet') }}
),
transfers AS (
    SELECT
        cm.block_number,
        cm.block_timestamp AS ts,
        cm.transaction_hash,
        cm.collateral_id,
        synths.synth_token_address,
        account_id,
        {{ convert_wei(
            'cm.amount_delta'
        ) }} AS amount_delta
    FROM
        {{ ref('perp_collateral_modified_arbitrum_mainnet') }} AS cm
        INNER JOIN synths
        ON cm.collateral_id = synths.collateral_id
),
liq_tx AS (
    SELECT
        DISTINCT transaction_hash,
        account_id
    FROM
        {{ ref('perp_account_liquidation_attempt_arbitrum_mainnet') }}
),
distributors AS (
    SELECT
        CAST(
            rd.distributor_address AS text
        ) AS distributor_address,
        CAST(
            rd.token_symbol AS text
        ) AS token_symbol,
        rd.synth_token_address,
        synths.collateral_id
    FROM
        {{ ref('arbitrum_mainnet_reward_distributors') }} AS rd
        INNER JOIN synths
        ON rd.synth_token_address = synths.synth_token_address
),
liquidations AS (
    SELECT
        block_number,
        block_timestamp AS ts,- amount / 1e18 AS amount_delta,
        liq_tx.transaction_hash,
        collateral_type,
        token_symbol,
        synth_token_address,
        account_id,
        distributors.collateral_id
    FROM
        prod_raw_arbitrum_mainnet.core_rewards_distributed_arbitrum_mainnet AS rd
        INNER JOIN liq_tx
        ON rd.transaction_hash = liq_tx.transaction_hash
        INNER JOIN distributors
        ON rd.distributor = distributors.distributor_address
),
net_transfers AS (
    SELECT
        events.ts,
        events.transaction_hash,
        events.event_type,
        events.collateral_id,
        events.synth_token_address,
        synths.synth_symbol,
        events.account_id,
        prices.price,
        events.amount_delta,
        SUM(
            events.amount_delta
        ) over (
            PARTITION BY events.account_id,
            events.collateral_id
            ORDER BY
                events.ts
        ) AS account_balance,
        SUM(
            events.amount_delta
        ) over (
            PARTITION BY events.collateral_id
            ORDER BY
                events.ts
        ) AS total_balance
    FROM
        (
            SELECT
                ts,
                transaction_hash,
                collateral_id,
                synth_token_address,
                account_id,
                amount_delta,
                'transfer' AS event_type
            FROM
                transfers
            UNION ALL
            SELECT
                ts,
                transaction_hash,
                collateral_id,
                synth_token_address,
                account_id,
                amount_delta,
                'liquidation' AS event_type
            FROM
                liquidations
        ) AS events
        INNER JOIN {{ ref('arbitrum_mainnet_synths') }} AS synths
        ON events.collateral_id = synths.synth_market_id
        LEFT JOIN {{ ref('fct_prices_hourly_arbitrum_mainnet') }} AS prices
        ON synths.token_symbol = prices.market_symbol
        AND DATE_TRUNC(
            'hour',
            events.ts
        ) = prices.ts
)
SELECT
    ts,
    transaction_hash,
    event_type,
    collateral_id,
    synth_token_address,
    synth_symbol,
    account_id,
    price,
    amount_delta,
    amount_delta * price AS amount_delta_usd,
    account_balance,
    account_balance * price AS account_balance_usd,
    total_balance,
    total_balance * price AS total_balance_usd
FROM
    net_transfers
