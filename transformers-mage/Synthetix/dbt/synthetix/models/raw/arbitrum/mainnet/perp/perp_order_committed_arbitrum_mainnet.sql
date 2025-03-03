with current_events as (
    {{ get_event_data(
        'arbitrum',
        'mainnet',
        'perps_market_proxy',
        'order_committed'
    ) }}
)

select
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    contract,
    event_name,
    market_id,
    account_id,
    commitment_time,
    expiration_time,
    settlement_time,
    expected_price_time,
    acceptable_price,
    order_type,
    size_delta,
    sender,
    tracking_code
from
    current_events
