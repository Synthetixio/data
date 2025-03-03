with liquidation_events as (
    select
        account_id,
        reward,
        block_timestamp,
        full_liquidation,
        SUM(
            case
                when full_liquidation then 1
                else 0
            end
        ) over (
            partition by account_id
            order by
                block_timestamp
            rows between unbounded preceding
            and current row
        ) as liquidation_id
    from
        {{ ref('perp_account_liquidation_attempt_arbitrum_sepolia') }}
),

cumulative_rewards as (
    select
        block_timestamp,
        reward,
        full_liquidation,
        liquidation_id,
        CAST(
            account_id as text
        ) as account_id,
        SUM({{ convert_wei('reward') }}) over (
            partition by
                account_id,
                liquidation_id
            order by
                block_timestamp
        ) as cumulative_reward,
        ROW_NUMBER() over (
            partition by
                account_id,
                liquidation_id
            order by
                block_timestamp desc
        ) as rn
    from
        liquidation_events
    order by
        block_timestamp
)

select
    account_id,
    block_timestamp as ts,
    cumulative_reward as total_reward
from
    cumulative_rewards
where
    rn = 1
