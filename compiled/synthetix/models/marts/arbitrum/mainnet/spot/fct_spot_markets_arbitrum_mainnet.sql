with base as (
    select
        synth_market_id as id,
        block_timestamp as created_ts,
        block_number,
        synth_token_address as token_address
    from
        "analytics"."prod_raw_arbitrum_mainnet"."spot_synth_registered_arbitrum_mainnet"
)

select *
from
    base