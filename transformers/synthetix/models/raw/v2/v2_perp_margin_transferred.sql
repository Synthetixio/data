WITH events AS ({{ get_v2_event_data('margin_transferred') }})
SELECT
    id,
    transaction_hash,
    block_timestamp,
    block_number,
    contract,
    UPPER(market) AS market,
    event_name,
    account,
    margin_delta
FROM
    events
