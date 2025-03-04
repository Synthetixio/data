

with meet_condition as(
  select *
  from "analytics"."prod_raw_base_sepolia"."perp_position_liquidated_base_sepolia"
),

validation_errors as (
  select *
  from meet_condition
  where
    -- never true, defaults to an empty result set. Exists to ensure any combo of the `or` clauses below succeeds
    1 = 2
    -- records with a value >= min_value are permitted. The `not` flips this to find records that don't meet the rule.
    or not amount_liquidated >= 0
)

select *
from validation_errors

