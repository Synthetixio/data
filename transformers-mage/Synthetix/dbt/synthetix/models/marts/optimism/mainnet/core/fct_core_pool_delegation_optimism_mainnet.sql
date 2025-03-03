with delegation_changes as (
    select
        block_timestamp,
        account_id,
        pool_id,
        collateral_type,
        {{ convert_wei('amount') }}
        - LAG({{ convert_wei('amount') }}, 1, 0) over (
            partition by
                account_id,
                pool_id,
                collateral_type
            order by
                block_timestamp
        ) as change_in_amount
    from
        {{ ref('core_delegation_updated_optimism_mainnet') }}
),

cumulative_delegation as (
    select
        block_timestamp,
        pool_id,
        collateral_type,
        SUM(change_in_amount) over (
            partition by
                pool_id,
                collateral_type
            order by
                block_timestamp
        ) as cumulative_amount_delegated
    from
        delegation_changes
)

select
    block_timestamp as ts,
    pool_id,
    collateral_type,
    cumulative_amount_delegated as amount_delegated
from
    cumulative_delegation
order by
    block_timestamp,
    collateral_type
