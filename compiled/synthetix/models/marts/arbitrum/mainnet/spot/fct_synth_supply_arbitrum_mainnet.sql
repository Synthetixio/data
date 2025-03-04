with wrapper as (
    select
        ts,
        block_number,
        synth_market_id,
        amount_wrapped as change_amount
    from
        "analytics"."prod_arbitrum_mainnet"."fct_spot_wrapper_arbitrum_mainnet"
),

atomics as (
    select
        ts,
        block_number,
        synth_market_id,
        amount as change_amount
    from
        "analytics"."prod_arbitrum_mainnet"."fct_spot_atomics_arbitrum_mainnet"
    union all
    select
        ts,
        block_number,
        0 as synth_market_id,
        amount * price * -1 as change_amount
    from
        "analytics"."prod_arbitrum_mainnet"."fct_spot_atomics_arbitrum_mainnet"
),

usd_changes as (
    select
        block_timestamp as ts,
        block_number,
        0 as synth_market_id,
        
    amount / 1e18
 as change_amount
    from
        "analytics"."prod_raw_arbitrum_mainnet"."core_usd_minted_arbitrum_mainnet"
    union all
    select
        block_timestamp as ts,
        block_number,
        0 as synth_market_id,
        -1 * 
    amount / 1e18
 as change_amount
    from
        "analytics"."prod_raw_arbitrum_mainnet"."core_usd_burned_arbitrum_mainnet"
),

all_changes as (
    select *
    from
        wrapper
    union all
    select *
    from
        atomics
    union all
    select *
    from
        usd_changes
)

select
    ts,
    block_number,
    synth_market_id,
    SUM(change_amount) over (
        partition by synth_market_id
        order by
            ts,
            block_number
    ) as supply
from
    all_changes