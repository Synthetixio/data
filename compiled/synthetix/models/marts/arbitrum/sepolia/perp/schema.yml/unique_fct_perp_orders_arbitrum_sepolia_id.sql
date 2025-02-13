
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_arbitrum_sepolia"."fct_perp_orders_arbitrum_sepolia"
where id is not null
group by id
having count(*) > 1


