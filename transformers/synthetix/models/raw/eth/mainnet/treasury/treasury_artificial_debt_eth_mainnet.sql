with base as (
    select
        block_number,
        contract_address,
        chain_id,
        cast(
            value_1 as numeric
        ) as artificial_debt
    from
        {{ source(
            'raw_eth_mainnet',
            "treasury_artificial_debt"
        ) }}
)

select
    to_timestamp(
        blocks.timestamp
    ) as ts,
    base.block_number,
    base.contract_address,
    {{ convert_wei('base.artificial_debt') }} as artificial_debt
from base
inner join {{ source(
    'raw_eth_mainnet',
    'blocks_parquet'
) }} as blocks
    on base.block_number = blocks.block_number
