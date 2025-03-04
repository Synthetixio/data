with burns as (
    select
        block_timestamp as ts,
        block_number,
        transaction_hash,
        pool_id,
        collateral_type,
        account_id,
        -1 * 
    amount / 1e18
 as amount
    from
        "analytics"."prod_raw_eth_mainnet"."core_usd_burned_eth_mainnet"
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
        
    amount / 1e18
 as amount
    from
        "analytics"."prod_raw_eth_mainnet"."core_usd_minted_eth_mainnet"
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