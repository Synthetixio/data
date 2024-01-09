WITH events AS ({{ get_v2_event_data('funding_recomputed') }})
SELECT
    id,
    transaction_hash,
    block_timestamp,
    block_number,
    contract,
    UPPER(market) AS market,
    event_name,
    INDEX,
    funding,
    funding_rate
FROM
    events
