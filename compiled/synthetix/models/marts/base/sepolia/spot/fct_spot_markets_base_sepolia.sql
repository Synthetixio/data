with base as (
    select
        synth_market_id as id,
        block_timestamp as created_ts,
        block_number,
        synth_token_address as token_address
    from
        "analytics"."prod_raw_base_sepolia"."spot_synth_registered_base_sepolia"
)

select *
from
    base