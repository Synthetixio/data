with current_events as (
    {{ get_event_data(
        'base',
        'sepolia',
        'buyback_snx',
        'buyback_processed'
    ) }}
)

select
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    event_name,
    contract,
    buyer,
    snx,
    usd
from
    current_events
