with base as (
    select
        block_number,
        contract_address,
        chain_id,
        pool_id,
        collateral_type,
        cast(
            value_1 as numeric
        ) as debt
    from
        {{ source(
            'raw_optimism_mainnet',
            "core_get_vault_debt"
        ) }}
    where
        value_1 is not null
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
    {{ convert_wei('base.debt') }} as debt
from base
inner join {{ source(
    'raw_optimism_mainnet',
    'blocks_parquet'
) }} as blocks
    on base.block_number = blocks.block_number

