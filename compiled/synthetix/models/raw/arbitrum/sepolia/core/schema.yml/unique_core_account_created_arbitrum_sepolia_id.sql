
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_arbitrum_sepolia"."core_account_created_arbitrum_sepolia"
where id is not null
group by id
having count(*) > 1


