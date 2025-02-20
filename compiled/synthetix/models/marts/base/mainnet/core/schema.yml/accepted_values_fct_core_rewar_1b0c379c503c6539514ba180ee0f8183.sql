
    
    

with all_values as (

    select
        reward_type as value_field,
        count(*) as n_records

    from "analytics"."prod_base_mainnet"."fct_core_rewards_claimed_base_mainnet"
    group by reward_type

)

select *
from all_values
where value_field not in (
    'liquidation','incentive'
)


