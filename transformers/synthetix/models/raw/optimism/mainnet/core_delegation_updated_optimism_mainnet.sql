with events as (
    {{ get_event_data('optimism', 'mainnet', 'core_proxy', 'delegation_updated') }} -- noqa
)

select
    id,
    transaction_hash,
    block_timestamp,
    block_number,
    contract,
    event_name,
    account_id,
    pool_id,
    collateral_type,
    amount,
    leverage,
    sender
from events