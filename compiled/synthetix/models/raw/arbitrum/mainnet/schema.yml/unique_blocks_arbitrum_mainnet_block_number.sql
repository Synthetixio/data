
    
    

select
    block_number as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_arbitrum_mainnet"."blocks_arbitrum_mainnet"
where block_number is not null
group by block_number
having count(*) > 1

