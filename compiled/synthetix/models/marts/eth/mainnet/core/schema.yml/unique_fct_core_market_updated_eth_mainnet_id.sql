
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_eth_mainnet"."fct_core_market_updated_eth_mainnet"
where id is not null
group by id
having count(*) > 1


