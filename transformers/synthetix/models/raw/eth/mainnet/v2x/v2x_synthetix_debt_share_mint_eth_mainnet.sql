{{ config(
    materialized = 'view'
) }}

with minted as (
    {{ get_event_data('eth', 'mainnet_v2x', 'synthetix_debt_share', 'mint') }}
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
from minted
