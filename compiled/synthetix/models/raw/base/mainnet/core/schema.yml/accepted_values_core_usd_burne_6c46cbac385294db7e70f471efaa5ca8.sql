
    
    

with all_values as (

    select
        event_name as value_field,
        count(*) as n_records

    from "analytics"."prod_raw_base_mainnet"."core_usd_burned_base_mainnet"
    group by event_name

)

select *
from all_values
where value_field not in (
    'UsdBurned'
)


