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
        "analytics"."prod_raw_base_mainnet"."spot_synth_wrapped_base_mainnet"
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
        "analytics"."prod_raw_base_mainnet"."spot_synth_unwrapped_base_mainnet"
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