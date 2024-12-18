with core_usd_burned as (
    {{ get_event_data('base', 'mainnet', 'synthetix', 'core_proxy', 'usd_burned') }} -- noqa
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    sender,
    cast(account_id as UInt128) as account_id,
    cast(pool_id as UInt128) as pool_id,
    collateral_type,
    cast(amount as UInt256) as amount
from core_usd_burned
