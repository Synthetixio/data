SELECT
    acceptable_price,
    event_name,
    account_id,
    market_id,
    commitment_time,
    block_number,
    tracking_code,
    contract,
    block_timestamp,
    size_delta,
    transaction_hash,
    id
FROM
    {{ ref("perp_previous_order_expired_base_sepolia") }}
