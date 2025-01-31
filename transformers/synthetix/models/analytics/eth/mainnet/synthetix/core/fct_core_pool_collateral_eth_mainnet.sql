{{
    config(
        materialized = 'view',
        tags = ["analytics", "pool", "collateral", "eth", "mainnet"],
    )
}}

with events as (
    select
        block_timestamp,
        {{ convert_wei('token_amount') }} as token_amount,
        collateral_type
    from
        {{ ref('core_deposited_eth_mainnet') }}
    union all
    select
        block_timestamp,
        -{{ convert_wei('token_amount') }} as token_amount,
        collateral_type
    from
        {{ ref('core_withdrawn_eth_mainnet') }}
),

ranked_events as (
    select
        block_timestamp,
        collateral_type,
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