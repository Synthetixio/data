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
    {{ convert_wei("acceptable_price") }} AS acceptable_price,
    {{ convert_wei("size_delta") }} AS size_delta
FROM
    {{ ref("perp_previous_order_expired_base_sepolia") }}
