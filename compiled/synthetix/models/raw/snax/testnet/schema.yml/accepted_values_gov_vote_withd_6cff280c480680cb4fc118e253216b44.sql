
    
    

with all_values as (

    select
        event_name as value_field,
        count(*) as n_records

    from "analytics"."prod_raw_snax_testnet"."gov_vote_withdrawn_snax_testnet"
    group by event_name

)

select *
from all_values
where value_field not in (
    'VoteWithdrawn'
)

