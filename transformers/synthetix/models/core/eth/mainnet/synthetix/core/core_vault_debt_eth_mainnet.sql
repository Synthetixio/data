{{
    config(
        materialized = 'view',
    )
}}

with base as (
    select
        cast(block_number as Int64) as block_number,
        contract_address,
        chain_id,
        cast(pool_id as Int128) as pool_id,
        collateral_type,
        cast(
            output_0 as Int256
        ) as debt
    from
        {{ source(
            'raw_eth_mainnet',
            'synthetix_core_proxy_function_get_vault_debt'
        ) }}
    where
        output_0 is not null
)

select
    blocks.ts as ts,
    blocks.block_number as block_number,
    base.contract_address,
    base.pool_id,
    base.collateral_type,
    {{ convert_wei('base.debt') }} as debt
from
    base
inner join {{ ref('blocks_eth_mainnet') }} as blocks
    on base.block_number = blocks.block_number