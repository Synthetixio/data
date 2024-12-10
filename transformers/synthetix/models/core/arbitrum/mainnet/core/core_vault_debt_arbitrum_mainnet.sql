with base as (
    select
        block_number,
        contract_address,
        chain_id,
        cast(pool_id as Int128) as pool_id,
        collateral_type,
        cast(
            value_1 as Int256
        ) as debt
    from
        {{ source(
            'raw_arbitrum_mainnet',
            'get_vault_debt'
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
    base.collateral_type,
    {{ convert_wei('base.debt') }} as debt
from
    base
inner join {{ source('raw_arbitrum_mainnet', 'blocks_parquet') }} as blocks
    on base.block_number = blocks.block_number
