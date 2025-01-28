{{
    config(
        materialized = 'view',
    )
}}

with core_account_created as (
    {{ get_event_data('base', 'mainnet', 'synthetix', 'core_proxy', 'account_created') }} -- noqa
)

select
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    id,
    cast(account_id as UInt128) as account_id,
    owner
from core_account_created
