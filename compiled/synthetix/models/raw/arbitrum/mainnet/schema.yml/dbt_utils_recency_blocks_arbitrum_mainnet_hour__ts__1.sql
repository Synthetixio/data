






with recency as (

    select 

      
      
        max(ts) as most_recent

    from "analytics"."prod_raw_arbitrum_mainnet"."blocks_arbitrum_mainnet"

    

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

