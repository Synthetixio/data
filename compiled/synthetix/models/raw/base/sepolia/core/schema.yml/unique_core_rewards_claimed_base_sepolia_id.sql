
    
    

select
    id as unique_field,
    count(*) as n_records

from "analytics"."prod_raw_base_sepolia"."core_rewards_claimed_base_sepolia"
where id is not null
group by id
having count(*) > 1


