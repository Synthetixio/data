
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_base_sepolia"."perp_market_created_base_sepolia"
where id is not null
group by id
having count(*) > 1

