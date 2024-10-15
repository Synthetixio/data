
    
    

with all_values as (

    select
        collateral_type as value_field,
        count(*) as n_records

    from "analytics"."prod_eth_mainnet"."fct_core_migration_eth_mainnet"
    group by collateral_type

)

select *
from all_values
where value_field not in (
    '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F'
)


