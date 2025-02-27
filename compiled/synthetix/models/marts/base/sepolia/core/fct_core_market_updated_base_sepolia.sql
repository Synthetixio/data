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
        "analytics"."prod_raw_base_sepolia"."core_market_updated_base_sepolia"
)

select
    id,
    block_timestamp as ts,
    transaction_hash,
    event_name,
    market_id,
    collateral_type,
    
    credit_capacity / 1e18
 as credit_capacity,
    
    net_issuance / 1e18
 as net_issuance,
    
    token_amount / 1e18
 as token_amount
from
    market_updated