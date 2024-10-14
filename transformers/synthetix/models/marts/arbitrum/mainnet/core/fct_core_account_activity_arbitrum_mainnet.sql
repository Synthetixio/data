{{ config(
    materialized = "view",
    tags = ["core", "account_activity", "daily", "arbitrum", "mainnet"]
) }}

with delegated as (
    select distinct
        block_timestamp,
        account_id,
        'Delegated' as account_action
    from {{ ref('core_delegation_updated_arbitrum_mainnet') }} as core
),

withdrawn as (
    select
        block_timestamp,
        account_id,
        'Withdrawn' as account_action
    from {{ ref('core_withdrawn_arbitrum_mainnet') }} as core
),

claimed as (
    select
        block_timestamp,
        account_id,
        'Claimed' as account_action
    from {{ ref('core_rewards_claimed_arbitrum_mainnet') }} as core
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