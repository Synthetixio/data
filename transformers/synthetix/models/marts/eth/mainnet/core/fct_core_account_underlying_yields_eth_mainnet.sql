{{
    config(
        materialized='table',
        indexes=[
            {'columns': ['account_id'], 'type': 'hash'}
        ]
    )
}}

with recursive yield_tokens as (
    select distinct collateral_type
    from {{ ref('fct_token_yields_eth_mainnet') }}
),

delegations as (
    select
        block_timestamp,
        account_id,
        pool_id,
        collateral_type,
        {{ convert_wei('amount') }} as amount
    from
        {{ ref('core_delegation_updated_eth_mainnet') }}
    where lower(collateral_type) in (select lower(collateral_type) from yield_tokens)
),

hourly_delegation as (
    select
        date_trunc('hour', block_timestamp) as block_timestamp,
        account_id,
        pool_id,
        collateral_type,
        last(amount) over (
            partition by account_id, pool_id, collateral_type, date_trunc('hour', block_timestamp)
            order by block_timestamp
            rows between unbounded preceding and unbounded following
        ) as amount
    from delegations
    order by block_timestamp asc
),

account_bounds AS (
    select
        account_id,
        pool_id,
        collateral_type,
        min(block_timestamp) as min_time,
        max(block_timestamp) as max_time
    from hourly_delegation
    group by account_id, pool_id, collateral_type
),

hourly_series AS (
    select
        ab.account_id,
        ab.pool_id,
        ab.collateral_type,
        ab.min_time as series_time
    from account_bounds ab

    union all

    select
        hs.account_id,
        hs.pool_id,
        hs.collateral_type,
        hs.series_time + INTERVAL '1 hour' as series_time
    from hourly_series hs
    join account_bounds ab on hs.account_id = ab.account_id
    where hs.series_time < ab.max_time
),

last_known_values AS (
    select
        hs.account_id,
        hs.pool_id,
        hs.collateral_type,
        hs.series_time,
        (
            select t.amount
            from hourly_delegation as t
            where t.account_id = hs.account_id
                and t.block_timestamp <= hs.series_time
            order by t.block_timestamp desc
            limit 1
        ) as amount
    from hourly_series hs
),

final_result as (
    select
        last_known_values.account_id,
        last_known_values.pool_id,
        last_known_values.collateral_type,
        last_known_values.series_time as block_timestamp,
        last_known_values.amount,
        token_yields.hourly_exchange_rate_pnl
    from last_known_values
    left join {{ ref('fct_token_yields_eth_mainnet') }} as token_yields
        on last_known_values.series_time = token_yields.ts
        and last_known_values.pool_id = token_yields.pool_id
        and lower(last_known_values.collateral_type) = lower(token_yields.collateral_type)
)

select
	account_id,
	pool_id,
	collateral_type,
	coalesce(sum(amount * hourly_exchange_rate_pnl), 0) as yield_usd
from final_result
group by account_id, pool_id, collateral_type
