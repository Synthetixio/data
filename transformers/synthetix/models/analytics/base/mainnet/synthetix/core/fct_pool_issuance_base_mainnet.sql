{{
    config(
        materialized = "view",
        tags = ["analytics", "pool", "issuance", "base", "mainnet"],
    )
}}

with burns as (
    select
        block_timestamp as ts,
        block_number,
        transaction_hash,
        pool_id,
        collateral_type,
        account_id,
        -1 * {{ convert_wei('amount') }} as amount
    from
        {{ ref('core_usd_burned_base_mainnet') }}
    order by
        block_timestamp desc
),

mints as (
    select
        block_timestamp as ts,
        block_number,
        transaction_hash,
        pool_id,
        collateral_type,
        account_id,
        {{ convert_wei('amount') }} as amount
    from
        {{ ref('core_usd_minted_base_mainnet') }}
    order by
        block_timestamp desc
)

select *
from
    burns
union all
select *
from
    mints
order by
    ts desc