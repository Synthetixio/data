with core_account_created as (
    {{ get_event_data('eth', 'mainnet', 'synthetix', 'legacy_market_proxy', 'account_migrated') }} -- noqa
)

select
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    id,
    staker,
    cast(account_id as UInt128) as account_id,
    cast(collateral_amount as UInt256) as collateral_amount,
    cast(debt_amount as UInt256) as debt_amount
from core_account_created
