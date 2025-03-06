with delegation_changes as (
    select
        block_timestamp as ts,
        account_id,
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
    where pool_id = 8
),

dim as (
    select
        generate_series(
            date_trunc('hour', min(ts)),
            date_trunc('hour', max(ts)),
            interval '1 hour'
        ) as ts
    from delegation_changes
),

prices as (
    select
        ts,
        price
    from {{ ref('fct_prices_hourly_optimism_mainnet') }}
    where market_symbol = 'SNX'
),

prices_ff as (
    select
        dim.ts,
        last(prices.price) over (
            order by prices.ts
            rows between unbounded preceding
            and current row
        ) as price
    from dim
    left join prices
        on prices.ts = dim.ts
),

delegated as (
    select
        delegation_changes.ts,
        account_id,
        change_in_amount,
        change_in_amount * prices_ff.price as change_in_value,
        sum(change_in_amount) over (order by delegation_changes.ts) as cumulative_amount,
        sum(change_in_amount * prices_ff.price) over (order by delegation_changes.ts) as cumulative_value,
        prices_ff.price as price
    from delegation_changes
    left join prices_ff
        on date_trunc('hour', delegation_changes.ts) = prices_ff.ts
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
