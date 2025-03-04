with base as (
    select
        block_number,
        contract_address,
        chain_id,
        pool_id,
        collateral_type,
        cast(
            amount as numeric
        ) as amount,
        cast(
            "value" as numeric
        ) as collateral_value
    from
        "analytics"."raw_eth_mainnet"."core_get_vault_collateral"
    where
        amount is not null
)

select
    to_timestamp(
        blocks.timestamp
    ) as ts,
    base.block_number,
    base.contract_address,
    cast(
        base.pool_id as integer
    ) as pool_id,
    cast(
        base.collateral_type as varchar
    ) as collateral_type,
    
    base.amount / 1e18
 as amount,
    
    base.collateral_value / 1e18
 as collateral_value
from base
inner join "analytics"."raw_eth_mainnet"."blocks_parquet" as blocks
    on base.block_number = blocks.block_number