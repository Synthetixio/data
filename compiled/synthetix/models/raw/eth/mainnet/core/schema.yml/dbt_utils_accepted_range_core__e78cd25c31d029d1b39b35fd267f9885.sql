

with meet_condition as(
  select *
  from "analytics"."prod_raw_eth_mainnet"."core_account_migrated_eth_mainnet"
),

validation_errors as (
  select *
  from meet_condition
  where
    -- never true, defaults to an empty result set. Exists to ensure any combo of the `or` clauses below succeeds
    1 = 2
    -- records with a value >= min_value are permitted. The `not` flips this to find records that don't meet the rule.
    or not collateral_amount >= 0
)

select *
from validation_errors

