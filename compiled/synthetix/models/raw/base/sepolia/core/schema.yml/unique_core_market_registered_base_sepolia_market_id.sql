
    
    

select
    market_id as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_base_sepolia"."core_market_registered_base_sepolia"
where market_id is not null
group by market_id
having count(*) > 1

