
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_base_sepolia"."fct_core_market_updated_base_sepolia"
where id is not null
group by id
having count(*) > 1


