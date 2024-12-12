with perps_collateral_modified as (
    {{ get_event_data(
        'base',
        'mainnet',
        'synthetix',
        'perps_market_proxy',
        'collateral_modified'
    ) }}
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    cast(account_id as UInt128) as account_id,
    cast(collateral_id as UInt128) as collateral_id,
    cast(amount_delta as Int256) as amount_delta,
    sender
from perps_collateral_modified