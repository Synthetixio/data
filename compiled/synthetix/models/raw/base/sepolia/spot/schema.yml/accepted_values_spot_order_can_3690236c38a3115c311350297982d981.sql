
    
    

with all_values as (

    select
        event_name as value_field,
        count(*) as n_records

    from "analytics"."prod_raw_base_sepolia"."spot_order_cancelled_base_sepolia"
    group by event_name

)

select *
from all_values
where value_field not in (
    'OrderCancelled'
)


