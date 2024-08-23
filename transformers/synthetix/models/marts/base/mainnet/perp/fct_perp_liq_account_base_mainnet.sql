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
        {{ ref('perp_account_liquidation_attempt_base_mainnet') }}
),

cumulative_rewards as (
    select
        le.block_timestamp,
        le.reward,
        le.full_liquidation,
        le.liquidation_id,
        CAST(
            le.account_id as text
        ) as account_id,
        SUM({{ convert_wei('reward') }}) over (
            partition by
                le.account_id,
                le.liquidation_id
            order by
                le.block_timestamp
        ) as cumulative_reward,
        ROW_NUMBER() over (
            partition by
                le.account_id,
                le.liquidation_id
            order by
                le.block_timestamp desc
        ) as rn
    from
        liquidation_events as le
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
