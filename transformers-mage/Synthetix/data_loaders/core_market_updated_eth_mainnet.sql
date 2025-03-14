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
        analytics.raw_eth_mainnet.core_proxy_event_market_collateral_deposited
    
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
        analytics.raw_eth_mainnet.core_proxy_event_market_collateral_withdrawn
    
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
        target AS sender,
        'USD' AS collateral_type,
        credit_capacity,
        amount AS token_amount
    FROM
        analytics.raw_eth_mainnet.core_proxy_event_market_usd_deposited
    
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
        target AS sender,
        'USD' AS collateral_type,
        credit_capacity,
        amount AS token_amount
    FROM
        analytics.raw_eth_mainnet.core_proxy_event_market_usd_withdrawn
)

SELECT *
FROM
    events
ORDER BY
    block_timestamp-- Docs: https://docs.mage.ai/guides/sql-blocks
