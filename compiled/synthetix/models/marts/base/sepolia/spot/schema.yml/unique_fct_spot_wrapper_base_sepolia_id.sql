
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_base_sepolia"."fct_spot_wrapper_base_sepolia"
where id is not null
group by id
having count(*) > 1


