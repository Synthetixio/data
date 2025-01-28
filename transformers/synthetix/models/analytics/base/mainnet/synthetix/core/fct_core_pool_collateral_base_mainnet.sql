{{
    config(
        materialized = 'view',
        tags = ["analytics", "pool", "collateral", "base", "mainnet"],
    )
}}

with market_updated as (
    select
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        market_id,
        net_issuance,
        sender,
        collateral_type,
        credit_capacity,
        token_amount
    from
        {{ ref('core_market_updated_base_mainnet') }}
)

select
    id,
    block_timestamp as ts,
    transaction_hash,
    event_name,
    market_id,
    collateral_type,
    {{ convert_wei("credit_capacity") }} as credit_capacity,
    {{ convert_wei("net_issuance") }} as net_issuance,
    {{ convert_wei("token_amount") }} as token_amount
from
    market_updated