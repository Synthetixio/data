{{
    config(
        materialized = 'view',
        tags = ['core', 'rewards', 'claimed', 'base', 'mainnet']
    )
}}

with core_rewards_claimed as (
    {{ get_event_data('base', 'mainnet', 'synthetix', 'core_proxy', 'rewards_claimed') }} -- noqa
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    cast(account_id as UInt128) as account_id,
    cast(pool_id as UInt128) as pool_id,
    collateral_type,
    distributor,
    cast(amount as UInt256) as amount
from core_rewards_claimed
