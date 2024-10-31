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
        ts,
        transaction_hash,
        event_type,
        collateral_id,
        synth_token_address,
        account_id,
        amount_delta,
        SUM(amount_delta) over (
            PARTITION BY account_id,
            collateral_id
            ORDER BY
                ts
        ) AS account_balance,
        SUM(amount_delta) over (
            PARTITION BY collateral_id
            ORDER BY
                ts
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
        ) A
)
SELECT
    ts,
    transaction_hash,
    event_type,
    collateral_id,
    synth_token_address,
    account_id,
    amount_delta,
    account_balance,
    total_balance
FROM
    net_transfers
