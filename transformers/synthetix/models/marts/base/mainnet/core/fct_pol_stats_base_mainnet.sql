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
        {{ ref('core_delegation_updated_base_mainnet') }}
    where pool_id = 8
),

delegated as (
    select
        ts,
        account_id,
        change_in_amount,
        sum(change_in_amount) over (order by ts) as cumulative_token_amount
    from delegation_changes
),

prices as (
    select
        ts,
        price
    from {{ ref('fct_prices_hourly_eth_mainnet') }}
    where market_symbol = 'SNX'
),

hourly_aggregates as (
    select
        date_trunc('hour', delegated.ts) as hour_ts,
        sum(change_in_amount) as hourly_change_in_amount,
        count(distinct account_id) as hourly_account_count,
        last(prices_hourly.price) as hourly_price
    from delegated
    left join (
        select
            date_trunc('hour', ts) as ts,
            last(price) as price
        from prices
        group by date_trunc('hour', ts)
    ) as prices_hourly
        on date_trunc('hour', delegated.ts) = prices_hourly.ts
    group by date_trunc('hour', delegated.ts), prices_hourly.price
),

daily_aggregates as (
    select
        date_trunc('day', delegated.ts) as day_ts,
        sum(change_in_amount) as daily_change_in_amount,
        count(distinct account_id) as daily_account_count,
        last(prices_daily.price) as daily_price
    from delegated
    left join (
        select
            date_trunc('day', ts) as ts,
            last(price) as price
        from prices
        group by date_trunc('day', ts)
    ) as prices_daily
        on date_trunc('day', delegated.ts) = prices_daily.ts
    group by date_trunc('day', delegated.ts), prices_daily.price
),

weekly_aggregates as (
    select
        date_trunc('week', delegated.ts) as week_ts,
        sum(change_in_amount) as weekly_change_in_amount,
        count(distinct account_id) as weekly_account_count,
        prices_weekly.price as weekly_price
    from delegated
    left join (
        select
            date_trunc('week', ts) as ts,
            last(price) as price
        from prices
        group by date_trunc('week', ts)
    ) as prices_weekly
        on date_trunc('week', delegated.ts) = prices_weekly.ts
    group by date_trunc('week', delegated.ts), prices_weekly.price
),

monthly_aggregates as (
    select
        date_trunc('month', delegated.ts) as month_ts,
        sum(change_in_amount) as monthly_change_in_amount,
        count(distinct account_id) as monthly_account_count,
        last(prices_monthly.price) as monthly_price
    from delegated
    left join (
        select
            date_trunc('month', ts) as ts,
            last(price) as price
        from prices
        group by date_trunc('month', ts)
    ) as prices_monthly
        on date_trunc('month', delegated.ts) = prices_monthly.ts
    group by date_trunc('month', delegated.ts), prices_monthly.price
),

delegation_with_prices as (
    select
        delegated.ts,
        account_id,
        change_in_amount,
        change_in_amount * hourly_price as change_in_usd,
        cumulative_token_amount,
        cumulative_token_amount * hourly_price as cumulative_usd,
        hourly_change_in_amount,
        hourly_change_in_amount * hourly_price as hourly_change_in_usd,
        hourly_price as hourly_price,
        hourly_account_count,
        daily_change_in_amount,
        daily_change_in_amount * daily_price as daily_change_in_usd,
        daily_price as daily_price,
        daily_account_count,
        weekly_change_in_amount,
        weekly_change_in_amount * weekly_price as weekly_change_in_usd,
        weekly_price as weekly_price,
        weekly_account_count,
        monthly_change_in_amount,
        monthly_change_in_amount * monthly_price as monthly_change_in_usd,
        monthly_price as monthly_price,
        monthly_account_count
    from delegated
    left join hourly_aggregates h
        on date_trunc('hour', delegated.ts) = h.hour_ts
    left join daily_aggregates d
        on date_trunc('day', delegated.ts) = d.day_ts
    left join weekly_aggregates w
        on date_trunc('week', delegated.ts) = w.week_ts
    left join monthly_aggregates m
        on date_trunc('month', delegated.ts) = m.month_ts
)

select
    ts,
    account_id,
    change_in_amount,
    change_in_usd,
    cumulative_token_amount,
    cumulative_usd,
    hourly_change_in_amount,
    hourly_change_in_usd,
    hourly_price,
    hourly_account_count,
    daily_change_in_amount,
    daily_change_in_usd,
    daily_price,
    daily_account_count,
    weekly_change_in_amount,
    weekly_change_in_usd,
    weekly_price,
    weekly_account_count,
    monthly_change_in_amount,
    monthly_change_in_usd,
    monthly_account_count,
    monthly_price
from delegation_with_prices
