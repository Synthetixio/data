with core_vault_liquidation as (
    {{ get_event_data(
        'arbitrum',
        'sepolia',
        'core_proxy',
        'vault_liquidation'
    ) }}
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    sender,
    cast(pool_id as UInt128) as pool_id,
    cast(collateral_type as text) as collateral_type,
    cast(liquidate_as_account_id as UInt128) as liquidate_as_account_id
from core_vault_liquidation