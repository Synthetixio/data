with core_liquidation as (
    {{ get_event_data('eth', 'mainnet', 'synthetix', 'core_proxy', 'liquidation') }} -- noqa
)

select
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    id,
    sender,
    liquidation_data,
    cast(account_id as UInt128) as account_id,
    cast(pool_id as UInt128) as pool_id,
    collateral_type,
    cast(liquidate_as_account_id as UInt128) as liquidate_as_account_id
from core_liquidation
