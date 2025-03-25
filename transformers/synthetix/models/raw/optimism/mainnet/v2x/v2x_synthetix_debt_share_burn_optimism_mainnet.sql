{{ config(
    materialized = 'view'
) }}

with burned as (
    {{ get_event_data('optimism', 'mainnet_v2x', 'synthetix_debt_share', 'burn') }}
)

select
    id,
    block_number,
    block_timestamp,
    transaction_hash,
    contract,
    event_name,
    account,
    amount
from burned
