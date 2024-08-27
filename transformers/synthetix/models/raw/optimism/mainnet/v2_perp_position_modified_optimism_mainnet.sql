{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_block_number on {{ this }} (block_number)", "create index if not exists idx_block_timestamp on {{ this }} (block_timestamp)", "create index if not exists idx_market on {{ this }} (market)", "create index if not exists idx_contract on {{ this }} (contract)", "create index if not exists idx_account on {{ this }} (account)" ]
) }}

with legacy_events as (
    {{ get_v2_event_data('optimism', 'mainnet', 'position_modified1') }} -- noqa
),

current_events as (
    {{ get_v2_event_data('optimism', 'mainnet', 'position_modified0') }} -- noqa
)

select *
from (
    select
        id,
        transaction_hash,
        contract,
        block_timestamp,
        block_number,
        upper(market) as market,
        event_name,
        account,
        funding_index,
        last_price,
        trade_size,
        "size",
        margin,
        fee,
        skew
    from
        current_events
    union all
    select
        id,
        transaction_hash,
        contract,
        block_timestamp,
        block_number,
        upper(market) as market,
        event_name,
        account,
        funding_index,
        last_price,
        trade_size,
        "size",
        margin,
        fee,
        null as skew
    from
        legacy_events
) as events
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
