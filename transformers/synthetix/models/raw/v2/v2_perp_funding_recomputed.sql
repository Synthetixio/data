{{ config(
    materialized = 'table',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_block_timestamp on {{ this }} (block_timestamp)", "create index if not exists idx_block_number on {{ this }} (block_number)", "create index if not exists idx_market on {{ this }} (market)" ]
) }}

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
