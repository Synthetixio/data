with wraps as (
    select
        id,
        block_timestamp as ts,
        block_number,
        transaction_hash as tx_hash,
        synth_market_id,
        
    amount_wrapped / 1e18
 as amount_wrapped
    from
        "analytics"."prod_raw_arbitrum_sepolia"."spot_synth_wrapped_arbitrum_sepolia"
),

unwraps as (
    select
        id,
        block_timestamp as ts,
        block_number,
        transaction_hash as tx_hash,
        synth_market_id,
        -1 * 
    amount_unwrapped / 1e18
 as amount_wrapped
    from
        "analytics"."prod_raw_arbitrum_sepolia"."spot_synth_unwrapped_arbitrum_sepolia"
)

select
    id,
    ts,
    block_number,
    tx_hash,
    synth_market_id,
    amount_wrapped
from
    wraps
union all
select
    id,
    ts,
    block_number,
    tx_hash,
    synth_market_id,
    amount_wrapped
from
    unwraps
order by
    ts