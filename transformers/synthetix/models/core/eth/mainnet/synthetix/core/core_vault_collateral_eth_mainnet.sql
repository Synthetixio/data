with base as (
    select
        block_number,
        contract_address,
        chain_id,
        cast(pool_id as Int128) as pool_id,
        collateral_type,
        cast(
            amount as UInt256
        ) as amount,
        cast(
            value as UInt256
        ) as collateral_value
    from
        {{ source(
            'raw_eth_mainnet',
            'get_vault_collateral'
        ) }}
    where
        amount is not null
)

select
    from_unixtime(blocks.timestamp) as ts,
    cast(
        blocks.block_number as integer
    ) as block_number,
    base.contract_address,
    base.pool_id,
    base.collateral_type,
    {{ convert_wei('base.amount') }} as amount,
    {{ convert_wei('base.collateral_value') }} as collateral_value
from
    base
inner join {{ source('raw_eth_mainnet', 'blocks_parquet') }} as blocks
    on base.block_number = blocks.block_number
