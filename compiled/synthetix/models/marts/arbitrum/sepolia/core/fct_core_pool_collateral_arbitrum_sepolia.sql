with events as (
    select
        block_timestamp,
        
    token_amount / 1e18
 as token_amount,
        collateral_type
    from
        "analytics"."prod_raw_arbitrum_sepolia"."core_deposited_arbitrum_sepolia"
    union all
    select
        block_timestamp,
        -
    token_amount / 1e18
 as token_amount,
        collateral_type
    from
        "analytics"."prod_raw_arbitrum_sepolia"."core_withdrawn_arbitrum_sepolia"
),

ranked_events as (
    select
        *,
        SUM(token_amount) over (
            partition by collateral_type
            order by
                block_timestamp
            rows between unbounded preceding
            and current row
        ) as amount_deposited
    from
        events
)

select
    block_timestamp as ts,
    collateral_type,
    amount_deposited
from
    ranked_events
order by
    block_timestamp,
    collateral_type