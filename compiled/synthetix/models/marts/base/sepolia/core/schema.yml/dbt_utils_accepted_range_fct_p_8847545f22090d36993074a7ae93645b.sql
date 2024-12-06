

with meet_condition as(
  select *
  from "analytics"."prod_base_sepolia"."fct_pool_pnl_hourly_base_sepolia"
),

validation_errors as (
  select *
  from meet_condition
  where
    -- never true, defaults to an empty result set. Exists to ensure any combo of the `or` clauses below succeeds
    1 = 2
    -- records with a value >= min_value are permitted. The `not` flips this to find records that don't meet the rule.
    or not hourly_rewards_pct >= 0
    -- records with a value <= max_value are permitted. The `not` flips this to find records that don't meet the rule.
    or not hourly_rewards_pct <= 1
)

select *
from validation_errors

