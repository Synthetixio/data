{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_block_number on {{ this }} (block_number)", "create index if not exists idx_block_timestamp on {{ this }} (block_timestamp)", "create index if not exists idx_market on {{ this }} (market)", "create index if not exists idx_contract on {{ this }} (contract)", "create index if not exists idx_account on {{ this }} (account)" ]
) }}

with events as (
    {{ get_v2_event_data('optimism', 'mainnet', 'delayed_order_submitted') }} -- noqa
)

select -- noqa: ST06
    id,
    transaction_hash,
    block_timestamp,
    block_number,
    contract,
    upper(market) as market,
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
from
    events
where
    {% if is_incremental() %}
        block_number > (
            select coalesce(max(block_number), 0) as b
            from {{ this }}
        )
    {% else %}
        true
    {% endif %}
order by
    id
