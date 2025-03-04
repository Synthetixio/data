with delegation_changes as (
    select
        block_timestamp,
        account_id,
        pool_id,
        collateral_type,
        
    amount / 1e18

        - LAG(
    amount / 1e18
, 1, 0) over (
            partition by
                account_id,
                pool_id,
                collateral_type
            order by
                block_timestamp
        ) as change_in_amount
    from
        "analytics"."prod_raw_base_sepolia"."core_delegation_updated_base_sepolia"
),

cumulative_delegation as (
    select
        block_timestamp,
        account_id,
        pool_id,
        collateral_type,
        SUM(change_in_amount) over (
            partition by
                pool_id,
                account_id,
                collateral_type
            order by
                block_timestamp
        ) as cumulative_amount_delegated,
        ROW_NUMBER() over (
            partition by
                pool_id,
                account_id,
                collateral_type
            order by
                block_timestamp desc
        ) as rn
    from
        delegation_changes
)

select
    block_timestamp as ts,
    pool_id,
    collateral_type,
    cumulative_amount_delegated as amount_delegated,
    CAST(
        account_id as text
    ) as account_id
from
    cumulative_delegation
where
    rn = 1
order by
    block_timestamp,
    collateral_type