with core_deposited as (
    {{ get_event_data(
        'base',
        'mainnet',
        'synthetix',
        'core_proxy',
        'deposited'
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
    collateral_type,
    cast(token_amount as UInt256) as token_amount
from core_deposited