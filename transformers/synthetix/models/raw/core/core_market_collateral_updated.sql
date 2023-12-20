WITH deposits AS (
    {{ get_event_data(
        'core_proxy',
        'market_collateral_deposited'
    ) }}
),
withdrawals AS (
    {{ get_event_data(
        'core_proxy',
        'market_collateral_withdrawn'
    ) }}
),
combined AS (
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
        token_amount,
        reported_debt
    FROM
        deposits
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
        token_amount,
        reported_debt
    FROM
        withdrawals
)
SELECT
    *
FROM
    combined
