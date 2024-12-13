with legacy_events as (
    {{ get_event_data('base', 'mainnet', 'synthetix', 'buyback_snx_legacy', 'buyback_processed') }} -- noqa
),

current_events as (
    {{ get_event_data('base', 'mainnet', 'synthetix', 'buyback_snx', 'buyback_processed') }} -- noqa
)

select
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    event_name,
    contract,
    buyer,
    cast(snx as UInt256) as snx,
    cast(usd as UInt256) as usd
from
    legacy_events
union all
select
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    event_name,
    contract,
    buyer,
    cast(snx as UInt256) as snx,
    cast(usd as UInt256) as usd
from
    current_events
