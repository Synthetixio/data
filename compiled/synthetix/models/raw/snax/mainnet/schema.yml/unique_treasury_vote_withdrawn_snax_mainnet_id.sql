
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_snax_mainnet"."treasury_vote_withdrawn_snax_mainnet"
where id is not null
group by id
having count(*) > 1


