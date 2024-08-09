SELECT
    id,
    block_timestamp,
    account_id,
    block_number,
    transaction_hash,
    contract,
    event_name,
    synth_market_id,
    sender,
    
    amount_delta / 1e18
 AS amount_delta
FROM
    "analytics"."prod_raw_base_mainnet"."perp_collateral_modified_base_mainnet"