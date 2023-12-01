with events as (
  SELECT
    block_timestamp,
    {{ convert_wei('token_amount') }} as token_amount,
    collateral_type
  from
    {{ ref('core_deposited') }}
  
  UNION ALL

  SELECT
    block_timestamp,
    -{{ convert_wei('token_amount') }} as token_amount,
    collateral_type
  from
    {{ ref('core_withdrawn') }}
),

ranked_events as (
  SELECT
    *,
    SUM(token_amount) OVER (
      PARTITION BY collateral_type
      ORDER BY block_timestamp
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as amount_deposited
  from events
)

select 
  block_timestamp as ts,
  collateral_type,
  amount_deposited
from ranked_events
order by block_timestamp, collateral_type
