WITH legacy_events AS (
    {{ get_event_data(
        'buyback_snx_legacy',
        'buyback_processed'
    ) }}
),
current_events AS (
    {{ get_event_data(
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
    legacy_events
UNION ALL
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
