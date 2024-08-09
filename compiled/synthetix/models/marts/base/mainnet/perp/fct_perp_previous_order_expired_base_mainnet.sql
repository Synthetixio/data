SELECT
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    market_id,
    account_id,
    commitment_time,
    tracking_code,
    
    acceptable_price / 1e18
 AS acceptable_price,
    
    size_delta / 1e18
 AS size_delta
FROM
    "analytics"."prod_raw_base_mainnet"."perp_previous_order_expired_base_mainnet"