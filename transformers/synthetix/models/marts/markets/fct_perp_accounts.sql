with base as ( 
  select
    cast(account_id as VARCHAR) as id,
    block_timestamp as created_ts,
    "owner"
  from 
    {{ ref('perp_account_created') }}
)

select
  *
from base
