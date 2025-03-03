select
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
    {{ convert_wei("acceptable_price") }} as acceptable_price,
    {{ convert_wei("size_delta") }} as size_delta
from
    {{ ref("perp_previous_order_expired_base_mainnet") }}
