
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_eth_mainnet"."core_account_migrated_eth_mainnet"
where id is not null
group by id
having count(*) > 1


