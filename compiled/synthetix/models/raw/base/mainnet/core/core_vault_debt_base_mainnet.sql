with base as (
    select
        block_number,
        contract_address,
        chain_id,
        pool_id,
        collateral_type,
        CAST(
            value_1 as numeric
        ) as debt
    from
        "analytics"."raw_base_mainnet"."core_get_vault_debt"
    where
        value_1 is not null
)

select
    TO_TIMESTAMP(
        blocks.timestamp
    ) as ts,
    CAST(
        blocks.block_number as integer
    ) as block_number,
    base.contract_address,
    CAST(
        base.pool_id as integer
    ) as pool_id,
    CAST(
        base.collateral_type as varchar
    ) as collateral_type,
    
    base.debt / 1e18
 as debt
from
    base
inner join "analytics"."raw_base_mainnet"."blocks_parquet" as blocks
    on base.block_number = blocks.block_number