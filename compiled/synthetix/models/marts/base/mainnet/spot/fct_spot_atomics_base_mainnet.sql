with bought as (
    select
        id,
        block_timestamp as ts,
        block_number,
        transaction_hash as tx_hash,
        synth_market_id,
        
    price / 1e18
 as price,
        
    synth_returned / 1e18
 as amount,
        referrer
    from
        "analytics"."prod_raw_base_mainnet"."spot_synth_bought_base_mainnet"
),

sold as (
    select
        id,
        block_timestamp as ts,
        block_number,
        transaction_hash as tx_hash,
        synth_market_id,
        
    price / 1e18
 as price,
        -1 * 
    amount_returned / 1e18
 as amount,
        referrer
    from
        "analytics"."prod_raw_base_mainnet"."spot_synth_sold_base_mainnet"
)

select
    id,
    ts,
    block_number,
    tx_hash,
    synth_market_id,
    price,
    amount,
    referrer
from
    bought
union all
select
    id,
    ts,
    block_number,
    tx_hash,
    synth_market_id,
    price,
    amount,
    referrer
from
    sold
order by
    ts