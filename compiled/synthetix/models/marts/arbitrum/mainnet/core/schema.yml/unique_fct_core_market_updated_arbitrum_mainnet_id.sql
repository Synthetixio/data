
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_arbitrum_mainnet"."fct_core_market_updated_arbitrum_mainnet"
where id is not null
group by id
having count(*) > 1

