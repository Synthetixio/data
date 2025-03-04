
    
    

with all_values as (

    select
        chain_id as value_field,
        count(*) as n_records

    from "analytics"."prod_raw_snax_mainnet"."spartan_vote_withdrawn_snax_mainnet"
    group by chain_id

)

select *
from all_values
where value_field not in (
    '2192','10','1','8453','42161'
)


