WITH synths AS (
    SELECT
        synth_market_id AS collateral_id,
        synth_token_address
    FROM
        {{ ref('spot_synth_registered_base_sepolia') }}
),
transfers AS (
    SELECT
        cm.block_number,
        cm.block_timestamp AS ts,
        cm.transaction_hash,
        cm.collateral_id,
        synths.synth_token_address,
        CAST(
            cm.account_id AS text
        ) AS account_id,
        {{ convert_wei('cm.amount_delta') }} AS amount_delta
    FROM
        {{ ref('perp_collateral_modified_base_sepolia') }} AS cm
        INNER JOIN synths
        ON cm.collateral_id = synths.collateral_id
),
liq_tx AS (
    SELECT
        DISTINCT transaction_hash,
        CAST(
            account_id AS text
        ) AS account_id
    FROM
        {{ ref('perp_account_liquidation_attempt_base_sepolia') }}
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
        {{ ref('base_sepolia_reward_distributors') }} AS rd
        INNER JOIN synths
        ON rd.synth_token_address = synths.synth_token_address
),
liquidations AS (
    SELECT
        rd.block_number,
        rd.block_timestamp AS ts,- rd.amount / 1e18 AS amount_delta,
        liq_tx.transaction_hash,
        rd.collateral_type,
        distributors.token_symbol,
        distributors.synth_token_address,
        CAST(
            liq_tx.account_id AS text
        ) AS account_id,
        distributors.collateral_id
    FROM
        {{ ref('core_rewards_distributed_base_sepolia') }} AS rd
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
                transfers.ts,
                transfers.transaction_hash,
                transfers.collateral_id,
                transfers.synth_token_address,
                transfers.account_id,
                transfers.amount_delta,
                'transfer' AS event_type
            FROM
                transfers
            UNION ALL
            SELECT
                liquidations.ts,
                liquidations.transaction_hash,
                liquidations.collateral_id,
                liquidations.synth_token_address,
                liquidations.account_id,
                liquidations.amount_delta,
                'liquidation' AS event_type
            FROM
                liquidations
        ) AS events
        INNER JOIN {{ ref('base_sepolia_synths') }} AS synths
        ON events.collateral_id = synths.synth_market_id
        LEFT JOIN {{ ref('fct_prices_hourly_base_sepolia') }} AS prices
        ON synths.token_symbol = prices.market_symbol
        AND DATE_TRUNC(
            'hour',
            events.ts
        ) = prices.ts
)
SELECT
    net_transfers.ts,
    net_transfers.transaction_hash,
    net_transfers.event_type,
    net_transfers.collateral_id,
    net_transfers.synth_token_address,
    net_transfers.synth_symbol,
    net_transfers.account_id,
    net_transfers.price,
    net_transfers.amount_delta,
    net_transfers.amount_delta * net_transfers.price AS amount_delta_usd,
    net_transfers.account_balance,
    net_transfers.account_balance * net_transfers.price AS account_balance_usd,
    net_transfers.total_balance,
    net_transfers.total_balance * net_transfers.price AS total_balance_usd
FROM
    net_transfers
