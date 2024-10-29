{{ config(
    materialized = "view",
    tags = ["perp", "account_activity", "arbitrum", "mainnet"]
) }}

with active_accounts as (
    select distinct
        date_trunc('day', ts) as activity_date,
        account_id
    from {{ ref('fct_perp_trades_arbitrum_mainnet') }}
),

date_range as (
    select
        generate_series(
            date(min(activity_date)),
            date(max(activity_date)),
            interval '1 day'
        )::date as activity_date
    from active_accounts
),

active_accounts_daily as (
    select
        date_range.activity_date,
        count(distinct active_accounts.account_id) as active_accounts
    from date_range
    left join active_accounts
        on date_range.activity_date = active_accounts.activity_date
    group by date_range.activity_date
),

active_accounts_monthly as (
    select
        date_range.activity_date,
        count(distinct active_accounts.account_id) as active_accounts
    from date_range
    left join active_accounts
        on
            date_range.activity_date - interval '27 days'
            <= active_accounts.activity_date
            and date_range.activity_date >= active_accounts.activity_date
    group by date_range.activity_date
),

new_accounts as (
    select
        min(activity_date) as start_date,
        account_id
    from active_accounts
    group by account_id
),

new_accounts_daily as (
    select
        date_range.activity_date,
        count(new_accounts.account_id) as new_accounts
    from date_range
    left join new_accounts
        on date_range.activity_date = new_accounts.start_date
    group by date_range.activity_date, new_accounts.start_date
),

new_accounts_monthly as (
    select distinct
        activity_date,
        sum(new_accounts) over (
            order by activity_date
            range between interval '27 days' preceding and current row
        ) as new_accounts
    from new_accounts_daily
)

select
    dr.activity_date,
    dau.active_accounts as dau,
    mau.active_accounts as mau,
    new_accounts_daily.new_accounts as new_accounts_daily,
    new_accounts_monthly.new_accounts as new_accounts_monthly
from date_range as dr
left join active_accounts_daily as dau
    on dr.activity_date = dau.activity_date
left join active_accounts_monthly as mau
    on dr.activity_date = mau.activity_date
left join new_accounts_daily
    on dr.activity_date = new_accounts_daily.activity_date
left join new_accounts_monthly
    on dr.activity_date = new_accounts_monthly.activity_date
order by dr.activity_date desc
