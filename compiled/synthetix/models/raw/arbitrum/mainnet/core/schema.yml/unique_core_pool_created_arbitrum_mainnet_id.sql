
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_arbitrum_mainnet"."core_pool_created_arbitrum_mainnet"
where id is not null
group by id
having count(*) > 1


