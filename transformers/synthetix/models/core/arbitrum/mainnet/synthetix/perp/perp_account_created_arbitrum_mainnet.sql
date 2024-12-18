with perps_account_created as (
    {{ get_event_data('arbitrum', 'mainnet', 'synthetix', 'perps_market_proxy', 'account_created') }} -- noqa
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    owner,
    cast(account_id as UInt128) as account_id
from perps_account_created
