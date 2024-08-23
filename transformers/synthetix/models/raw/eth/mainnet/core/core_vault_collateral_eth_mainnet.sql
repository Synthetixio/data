with base as (
    select
        block_number,
        contract_address,
        chain_id,
        pool_id,
        collateral_type,
        CAST(
            amount as numeric
        ) as amount,
        CAST(
            "value" as numeric
        ) as collateral_value
    from
        {{ source(
            'raw_eth_mainnet',
            "core_get_vault_collateral"
        ) }}
    where
        amount is not null
)

select
    blocks.ts,
    base.block_number,
    base.contract_address,
    CAST(
        base.pool_id as integer
    ) as pool_id,
    CAST(
        base.collateral_type as varchar
    ) as collateral_type,
    {{ convert_wei('base.amount') }} as amount,
    {{ convert_wei('base.collateral_value') }} as collateral_value
from
    base
inner join {{ source('raw_eth_mainnet', 'blocks_parquet') }} as blocks
    on base.block_number = blocks.block_number
