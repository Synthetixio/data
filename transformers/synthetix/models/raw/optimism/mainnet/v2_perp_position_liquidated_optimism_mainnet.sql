{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_block_timestamp on {{ this }} (block_timestamp)", "create index if not exists idx_block_number on {{ this }} (block_number)", "create index if not exists idx_market on {{ this }} (market)" ]
) }}

with legacy_events as (
    {{ get_v2_event_data('optimism', 'mainnet', 'position_liquidated1') }} -- noqa
),

current_events as (
    {{ get_v2_event_data('optimism', 'mainnet', 'position_liquidated0') }} -- noqa
)

select
    id,
    transaction_hash,
    block_number,
    block_timestamp,
    contract,
    upper(market) as market,
    event_name,
    account,
    liquidator,
    stakers_fee,
    liquidator_fee,
    flagger_fee,
    stakers_fee + liquidator_fee + flagger_fee as total_fee,
    price
from
    current_events
where
    {% if is_incremental() %}
        block_number > (
            select coalesce(max(block_number), 0) as b
            from {{ this }}
        )
    {% else %}
        true
    {% endif %}

union all

select
    id,
    transaction_hash,
    block_number,
    block_timestamp,
    contract,
    upper(market) as market,
    event_name,
    account,
    liquidator,
    fee as stakers_fee,
    0 as liquidator_fee,
    0 as flagger_fee,
    fee as total_fee,
    price
from
    legacy_events
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
