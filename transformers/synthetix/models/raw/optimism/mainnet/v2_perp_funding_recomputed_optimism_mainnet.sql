{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_block_timestamp on {{ this }} (block_timestamp)", "create index if not exists idx_block_number on {{ this }} (block_number)", "create index if not exists idx_market on {{ this }} (market)" ]
) }}

with events as ({{ get_v2_event_data('optimism', 'mainnet', 'funding_recomputed') }})
select
    id,
    transaction_hash,
    block_timestamp,
    block_number,
    contract,
    upper(market) as market,
    event_name,
    index,
    funding,
    funding_rate
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
