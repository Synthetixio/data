
    
    

select
    transaction_hash as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_snax_testnet"."gov_vote_recorded_snax_testnet"
where transaction_hash is not null
group by transaction_hash
having count(*) > 1


