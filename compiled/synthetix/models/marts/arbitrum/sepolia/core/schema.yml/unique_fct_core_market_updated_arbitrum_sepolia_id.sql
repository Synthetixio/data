
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_arbitrum_sepolia"."fct_core_market_updated_arbitrum_sepolia"
where id is not null
group by id
having count(*) > 1


