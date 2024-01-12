{{ config(
    materialized = 'table',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_block_timestamp on {{ this }} (block_timestamp)", "create index if not exists idx_market on {{ this }} (market)", "create index if not exists idx_account on {{ this }} (account)" ]
) }}

WITH events AS ({{ get_v2_event_data('delayed_order_submitted') }})
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
