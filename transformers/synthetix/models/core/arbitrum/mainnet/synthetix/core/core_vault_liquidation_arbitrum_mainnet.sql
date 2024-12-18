with core_vault_liquidation as (
    {{ get_event_data('arbitrum', 'mainnet', 'synthetix', 'core_proxy', 'vault_liquidation') }} -- noqa
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    sender,
    liquidation_data,
    cast(pool_id as UInt128) as pool_id,
    cast(collateral_type as String) as collateral_type,
    cast(liquidate_as_account_id as UInt128) as liquidate_as_account_id
from core_vault_liquidation
