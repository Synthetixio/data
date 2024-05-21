WITH events AS (
    {% if target.name in (
            'base_mainnet',
            'base_sepolia'
        ) %}
    SELECT
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        "contract",
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
                'core_proxy_legacy',
                'market_usd_deposited'
            ) }}
        ) legacy_usd_deposited
    UNION ALL
    SELECT
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        "contract",
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
                'core_proxy_legacy',
                'market_usd_withdrawn'
            ) }}
        ) legacy_usd_withdrawn
    UNION ALL
    {% endif %}
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
                'core_proxy',
                'market_usd_withdrawn'
            ) }}
        ) usd_withdrawn
)
SELECT
    *
FROM
    events
