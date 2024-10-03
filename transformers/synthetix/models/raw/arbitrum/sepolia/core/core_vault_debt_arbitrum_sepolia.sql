with base as (
    select
        block_number,
        contract_address,
        chain_id,
        pool_id,
        collateral_type,
        cast(
            value_1 as Int256
        ) as debt
    from
        {{ source(
            'raw_arbitrum_sepolia',
            "get_vault_debt"
        ) }}
    where
        value_1 is not null
)

select
    from_unixtime(blocks.timestamp) as ts,
    cast(
        blocks.block_number as integer
    ) as block_number,
    base.contract_address,
    base.pool_id,
    cast(
        base.collateral_type as varchar
    ) as collateral_type,
    {{ convert_wei('base.debt') }} as debt
from
    base
inner join {{ source('raw_arbitrum_sepolia', 'blocks') }} as blocks
    on base.block_number = blocks.block_number
