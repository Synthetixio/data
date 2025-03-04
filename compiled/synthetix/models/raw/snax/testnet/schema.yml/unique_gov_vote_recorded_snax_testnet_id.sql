
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_snax_testnet"."gov_vote_recorded_snax_testnet"
where id is not null
group by id
having count(*) > 1


