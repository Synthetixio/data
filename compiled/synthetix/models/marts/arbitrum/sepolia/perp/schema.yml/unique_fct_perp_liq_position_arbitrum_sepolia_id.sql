
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_arbitrum_sepolia"."fct_perp_liq_position_arbitrum_sepolia"
where id is not null
group by id
having count(*) > 1


