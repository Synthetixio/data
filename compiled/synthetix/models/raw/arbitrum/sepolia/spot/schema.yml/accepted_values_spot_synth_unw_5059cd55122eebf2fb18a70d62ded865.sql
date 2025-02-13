
    
    

with all_values as (

    select
        event_name as value_field,
        count(*) as n_records

    from "analytics"."prod_raw_arbitrum_sepolia"."spot_synth_unwrapped_arbitrum_sepolia"
    group by event_name

)

select *
from all_values
where value_field not in (
    'SynthUnwrapped'
)


