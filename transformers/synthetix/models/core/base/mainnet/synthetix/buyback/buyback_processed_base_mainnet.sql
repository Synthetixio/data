with legacy_events as (
    {{ get_event_data( -- noqa
        'base',
        'mainnet',
        'synthetix',
        'buyback_snx_legacy',
        'buyback_processed'
    ) }}
),

current_events as (
    {{ get_event_data( -- noqa
        'base',
        'mainnet',
        'synthetix',
        'buyback_snx',
        'buyback_processed'
    ) }}
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
