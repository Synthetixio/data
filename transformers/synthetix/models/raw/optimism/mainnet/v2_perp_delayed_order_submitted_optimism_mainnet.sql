{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_block_number on {{ this }} (block_number)", "create index if not exists idx_block_timestamp on {{ this }} (block_timestamp)", "create index if not exists idx_market on {{ this }} (market)", "create index if not exists idx_contract on {{ this }} (contract)", "create index if not exists idx_account on {{ this }} (account)" ]
) }}

WITH events AS ({{ get_v2_event_data('optimism', 'mainnet', 'delayed_order_submitted') }})
SELECT
    id,
    transaction_hash,
    block_timestamp,
    block_number,
    contract,
    UPPER(market) AS market,
    event_name,
    account,
    commit_deposit,
    keeper_deposit,
    executable_at_time,
    intention_time,
    target_round_id,
    is_offchain,
    size_delta,
    tracking_code
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
    ORDER BY
        id
