with base as ( 
  select
    perps_market_id as id,
    block_timestamp as created_ts,
    block_number,
    market_symbol,
    market_name
  from 
    {{ ref('perp_market_created') }}
)

select
  *
from base
