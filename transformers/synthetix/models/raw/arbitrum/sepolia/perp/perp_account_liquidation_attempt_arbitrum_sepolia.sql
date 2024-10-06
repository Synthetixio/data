with perps_account_liquidation_attempt as (
    {{ get_event_data(
        'arbitrum',
        'sepolia',
        'perps_market_proxy',
        'account_liquidation_attempt'
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
    cast(reward as UInt256) as reward,
    full_liquidation
from perps_account_liquidation_attempt
