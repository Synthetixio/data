with base as ( 
  select
    synth_market_id as id,
    block_timestamp as created_ts,
    block_number,
    synth_token_address as token_address
  from 
    {{ ref('spot_synth_registered') }}
)

select * from base