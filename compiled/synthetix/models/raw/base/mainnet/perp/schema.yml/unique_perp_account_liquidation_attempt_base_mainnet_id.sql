
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_base_mainnet"."perp_account_liquidation_attempt_base_mainnet"
where id is not null
group by id
having count(*) > 1


