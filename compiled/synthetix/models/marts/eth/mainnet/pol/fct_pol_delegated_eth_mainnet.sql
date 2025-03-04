with delegation_changes as (
    select
        block_timestamp as ts,
        account_id,
        
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
        "analytics"."prod_raw_eth_mainnet"."core_delegation_updated_eth_mainnet"
    where pool_id = 8
),

prices as (
    select
        ts,
        price
    from "analytics"."prod_eth_mainnet"."fct_prices_hourly_eth_mainnet"
    where market_symbol = 'SNX'
),

delegated as (
    select
        delegation_changes.ts,
        account_id,
        change_in_amount,
        change_in_amount * prices.price as change_in_value,
        sum(change_in_amount) over (order by delegation_changes.ts) as cumulative_amount,
        sum(change_in_amount * prices.price) over (order by delegation_changes.ts) as cumulative_value,
        prices.price as price
    from delegation_changes
    left join prices
        on date_trunc('hour', delegation_changes.ts) = prices.ts
)

select
    ts,
    account_id,
    change_in_amount,
    change_in_value,
    cumulative_amount,
    cumulative_value,
    price
from delegated