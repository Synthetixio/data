
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_base_mainnet"."core_usd_burned_base_mainnet"
where id is not null
group by id
having count(*) > 1

