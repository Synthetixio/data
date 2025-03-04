

with delegated as (
    select distinct
        block_timestamp,
        account_id,
        'Delegated' as account_action
    from "analytics"."prod_raw_base_sepolia"."core_delegation_updated_base_sepolia"
),

withdrawn as (
    select
        block_timestamp,
        account_id,
        'Withdrawn' as account_action
    from "analytics"."prod_raw_base_sepolia"."core_withdrawn_base_sepolia"
),

claimed as (
    select
        block_timestamp,
        account_id,
        'Claimed' as account_action
    from "analytics"."prod_raw_base_sepolia"."core_rewards_claimed_base_sepolia"
),

combined as (
    select * from delegated
    union all
    select * from withdrawn
    union all
    select * from claimed
)

select
    block_timestamp,
    account_action,
    account_id
from combined