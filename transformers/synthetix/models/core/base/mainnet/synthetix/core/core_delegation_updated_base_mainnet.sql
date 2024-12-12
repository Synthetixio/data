with delegation_updated as (
    {{ get_event_data(
        'base',
        'mainnet',
        'synthetix',
        'core_proxy',
        'delegation_updated'
    ) }}
)

select
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    id,
    sender,
    cast(account_id as UInt128) as account_id,
    cast(pool_id as UInt128) as pool_id,
    collateral_type,
    cast(amount as UInt256) as amount,
    cast(leverage as UInt256) as leverage
from
    delegation_updated