

with delegated as (
    select distinct
        block_timestamp,
        account_id,
        'Delegated' as account_action
    from "analytics"."prod_raw_base_mainnet"."core_delegation_updated_base_mainnet"
),

withdrawn as (
    select
        block_timestamp,
        account_id,
        'Withdrawn' as account_action
    from "analytics"."prod_raw_base_mainnet"."core_withdrawn_base_mainnet"
),

claimed as (
    select
        block_timestamp,
        account_id,
        'Claimed' as account_action
    from "analytics"."prod_raw_base_mainnet"."core_rewards_claimed_base_mainnet"
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