
    
    

with all_values as (

    select
        account_action as value_field,
        count(*) as n_records

    from "analytics"."prod_arbitrum_sepolia"."fct_core_account_activity_arbitrum_sepolia"
    group by account_action

)

select *
from all_values
where value_field not in (
    'Delegated','Withdrawn','Claimed'
)


