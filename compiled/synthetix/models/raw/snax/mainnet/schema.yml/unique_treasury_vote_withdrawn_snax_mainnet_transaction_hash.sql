
    
    

select
    transaction_hash as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_snax_mainnet"."treasury_vote_withdrawn_snax_mainnet"
where transaction_hash is not null
group by transaction_hash
having count(*) > 1


