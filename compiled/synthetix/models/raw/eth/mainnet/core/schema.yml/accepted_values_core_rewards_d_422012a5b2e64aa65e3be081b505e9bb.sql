
    
    

with all_values as (

    select
        event_name as value_field,
        count(*) as n_records

    from "analytics"."prod_raw_eth_mainnet"."core_rewards_distributed_eth_mainnet"
    group by event_name

)

select *
from all_values
where value_field not in (
    'RewardsDistributed'
)


