with core_usd_minted as (
    {{ get_event_data('arbitrum', 'mainnet', 'synthetix', 'core_proxy', 'usd_minted') }} -- noqa
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
from core_usd_minted
