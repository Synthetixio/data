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
        {{ ref('perp_collateral_modified_arbitrum_mainnet') }}
        cm
        JOIN synths
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
        {{ ref('arbitrum_mainnet_reward_distributors') }}
        rd
        JOIN synths
        ON synths.synth_token_address = rd.synth_token_address
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
        prod_raw_arbitrum_mainnet.core_rewards_distributed_arbitrum_mainnet rd
        JOIN liq_tx
        ON rd.transaction_hash = liq_tx.transaction_hash
        JOIN distributors
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
        ) events
        JOIN {{ ref('arbitrum_mainnet_synths') }}
        synths
        ON events.collateral_id = synths.synth_market_id
)
SELECT
    ts,
    transaction_hash,
    event_type,
    collateral_id,
    synth_token_address,
    synth_symbol,
    account_id,
    amount_delta,
    account_balance,
    total_balance
FROM
    net_transfers
