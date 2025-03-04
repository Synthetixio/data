






with recency as (

    select 

      
      
        max(ts) as most_recent

    from "analytics"."prod_raw_base_mainnet"."blocks_base_mainnet"

    

)

select

    
    most_recent,
    cast(

    now() + ((interval '1 hour') * (-1))

 as timestamp) as threshold

from recency
where most_recent < cast(

    now() + ((interval '1 hour') * (-1))

 as timestamp)

