WITH events AS (
    SELECT
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        market_id,
        net_issuance,
        deposited_collateral_value,
        sender,
        collateral_type,
        credit_capacity,
        token_amount
    FROM
        (
            {{ get_event_data(
                'arbitrum',
                'mainnet',
                'core_proxy',
                'market_collateral_deposited'
            ) }}
        ) collateral_deposited
    UNION ALL
    SELECT
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        market_id,
        net_issuance,
        deposited_collateral_value,
        sender,
        collateral_type,
        credit_capacity,
        token_amount
    FROM
        (
            {{ get_event_data(
                'arbitrum',
                'mainnet',
                'core_proxy',
                'market_collateral_withdrawn'
            ) }}
        ) collateral_withdrawn
    UNION ALL
    SELECT
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        market_id,
        net_issuance,
        deposited_collateral_value,
        "target" AS sender,
        'USD' AS collateral_type,
        credit_capacity,
        amount AS token_amount
    FROM
        (
            {{ get_event_data(
                'arbitrum',
                'mainnet',
                'core_proxy',
                'market_usd_deposited'
            ) }}
        ) usd_deposited
    UNION ALL
    SELECT
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        market_id,
        net_issuance,
        deposited_collateral_value,
        "target" AS sender,
        'USD' AS collateral_type,
        credit_capacity,
        amount AS token_amount
    FROM
        (
            {{ get_event_data(
                'arbitrum',
                'mainnet',
                'core_proxy',
                'market_usd_withdrawn'
            ) }}
        ) usd_withdrawn
)
SELECT
    *
FROM
    events
ORDER BY
    block_timestamp
