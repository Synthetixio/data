{{ config(
    materialized = "view",
    tags = ["core", "account_activity", "daily", "arbitrum", "sepolia"]
) }}

with delegated as (
    select distinct
        block_timestamp,
        account_id,
        'Delegated' as account_action
    from {{ ref('core_delegation_updated_arbitrum_sepolia') }}
),

withdrawn as (
    select
        block_timestamp,
        account_id,
        'Withdrawn' as account_action
    from {{ ref('core_withdrawn_arbitrum_sepolia') }}
),

claimed as (
    select
        block_timestamp,
        account_id,
        'Claimed' as account_action
    from {{ ref('core_rewards_claimed_arbitrum_sepolia') }}
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
