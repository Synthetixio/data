
    
    

with all_values as (

    select
        event_name as value_field,
        count(*) as n_records

    from "analytics"."prod_base_sepolia"."fct_perp_collateral_modified_base_sepolia"
    group by event_name

)

select *
from all_values
where value_field not in (
    'CollateralModified'
)


