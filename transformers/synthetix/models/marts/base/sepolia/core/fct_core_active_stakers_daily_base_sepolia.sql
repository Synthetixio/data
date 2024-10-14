{{ config(
    materialized = "view",
    tags = ["core", "active_stakers", "daily", "base", "sepolia"]
) }}

with delegation_updated as (
    select
        block_timestamp,
        account_id,
        amount
    from {{ ref('core_delegation_updated_base_sepolia') }} as core
),

dim as (
    select  
        d.date,
        accounts.account_id
    from (
        select 
            generate_series(
                date_trunc('day', date('2023-12-15')),
                date_trunc('day', current_date), '1 day'::interval
            ) as date
    ) as d
    cross join (
        select distinct account_id from delegation_updated
    ) as accounts
),

stakers as (
    select 
        date,
        dim.account_id,
        case when coalesce(last(amount) over (
            partition by dim.account_id
            order by date
            rows between unbounded preceding and current row
        ), 0) = 0 then 0 else 1 end as is_staking
    from dim
    left join delegation_updated
        on dim.date = date(delegation_updated.block_timestamp)
        and dim.account_id = delegation_updated.account_id
)

select
    date,
    sum(is_staking) as nof_stakers_daily
from stakers
group by date