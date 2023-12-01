with wraps as ( 
  select
    id,
    block_timestamp as ts,
    block_number,
    synth_market_id,
    {{ convert_wei('amount_wrapped') }} as amount_wrapped
  from 
    {{ ref('spot_synth_wrapped') }}
),

unwraps as ( 
  select
    id,
    block_timestamp as ts,
    block_number,
    synth_market_id,
    -1 * {{ convert_wei('amount_unwrapped') }} as amount_wrapped
  from 
    {{ ref('spot_synth_unwrapped') }}
)

select
  id,
  ts,
  block_number,
  synth_market_id,
  amount_wrapped
from
  wraps
union all
select
  id,
  ts,
  block_number,
  synth_market_id,
  amount_wrapped
from
  unwraps
order by
  ts