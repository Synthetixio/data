{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_block_timestamp on {{ this }} (block_timestamp)", "create index if not exists idx_block_number on {{ this }} (block_number)", "create index if not exists idx_market on {{ this }} (market)" ]
) }}

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
WHERE

{% if is_incremental() %}
block_number > (
    SELECT
        COALESCE(MAX(block_number), 0)
    FROM
        {{ this }})
    {% else %}
        TRUE
    {% endif %}
