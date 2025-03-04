
    
    

with all_values as (

    select
        event_name as value_field,
        count(*) as n_records

    from "analytics"."prod_raw_arbitrum_sepolia"."perp_previous_order_expired_arbitrum_sepolia"
    group by event_name

)

select *
from all_values
where value_field not in (
    'PreviousOrderExpired'
)


