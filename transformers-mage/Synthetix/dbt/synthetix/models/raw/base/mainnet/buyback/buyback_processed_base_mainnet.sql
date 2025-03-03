with legacy_events as (
    {{ get_event_data(
        'base',
        'mainnet',
        'buyback_snx_legacy',
        'buyback_processed'
    ) }}
),

current_events as (
    {{ get_event_data(
        'base',
        'mainnet',
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
    snx,
    usd
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
    snx,
    usd
from
    current_events
