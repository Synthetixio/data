with base as (
    select
        cast(block_number as Int64) as block_number,
        contract_address,
        chain_id,
        pool_id,
        collateral_type,
        value_1 as debt 
    from
        {{ source(
            'raw_base_mainnet',
            'synthetix_core_proxy_function_get_vault_debt'
        ) }}
    where
        value_1 is not null
)

select
    from_unixtime(blocks.timestamp) as ts,
    blocks.block_number as block_number,
    base.contract_address,
    base.pool_id,
    base.collateral_type,
    {{ convert_wei('base.debt') }} as debt
from
    base
inner join {{ source('raw_base_mainnet', 'blocks_parquet') }} as blocks
    on base.block_number = blocks.block_number
