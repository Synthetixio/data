
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_arbitrum_mainnet"."spot_synth_sold_arbitrum_mainnet"
where id is not null
group by id
having count(*) > 1

