{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_block_number on {{ this }} (block_number)", "create index if not exists idx_block_timestamp on {{ this }} (block_timestamp)", "create index if not exists idx_token on {{ this }} (token)", "create index if not exists idx_contract on {{ this }} (contract)" ]
) }}

with events as (
    {{ get_tlx_event_data('optimism', 'mainnet', 'rebalanced') }} -- noqa
)

select * -- noqa: ST06
from
    events
where
    {% if is_incremental() %}
        block_number > (
            select coalesce(max(t.block_number), 0) as b
            from {{ this }} as t
        )
    {% else %}
        true
    {% endif %}
order by
    id
