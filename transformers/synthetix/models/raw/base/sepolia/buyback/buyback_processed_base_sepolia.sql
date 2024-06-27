WITH current_events AS (
    {{ get_event_data(
        'base',
        'sepolia',
        'buyback_snx',
        'buyback_processed'
    ) }}
)

SELECT
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    event_name,
    contract,
    buyer,
    snx,
    usd
FROM
    current_events
