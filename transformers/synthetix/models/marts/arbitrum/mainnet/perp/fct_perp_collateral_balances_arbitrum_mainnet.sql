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
        cm.collateral_id,
        synths.synth_token_address,
        cm.amount_delta / 1e18 AS amount_delta
    FROM
        {{ ref('perp_collateral_modified_arbitrum_mainnet') }}
        cm
        JOIN synths
        ON cm.collateral_id = synths.collateral_id
),
liq_tx AS (
    SELECT
        DISTINCT transaction_hash
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
        collateral_type,
        token_symbol,
        synth_token_address,
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
        event_type,
        collateral_id,
        synth_token_address,
        amount_delta,
        SUM(amount_delta) over (
            PARTITION BY collateral_id
            ORDER BY
                ts
        ) AS net_amount
    FROM
        (
            SELECT
                ts,
                collateral_id,
                synth_token_address,
                amount_delta,
                'transfer' AS event_type
            FROM
                transfers
            UNION ALL
            SELECT
                ts,
                collateral_id,
                synth_token_address,
                amount_delta,
                'liquidation' AS event_type
            FROM
                liquidations
        ) A
)
SELECT
    ts,
    collateral_id,
    synth_token_address,
    event_type,
    amount_delta,
    net_amount
FROM
    net_transfers