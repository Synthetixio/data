
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_base_mainnet"."fct_perp_accounts_base_mainnet"
where id is not null
group by id
having count(*) > 1


