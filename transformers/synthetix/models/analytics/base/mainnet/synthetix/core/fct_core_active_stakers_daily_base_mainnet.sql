{{ 
    config(
        materialized = "view",
        tags = ["analytics", "active_stakers", "base", "mainnet"]
    ) 
}}

with delegation_updated as (
    select
        block_timestamp,
        account_id,
        amount
    from {{ ref('core_delegation_updated_base_mainnet') }}
),

dim as (
    select
        d.block_date,
        accounts_unique.account_id
    from (
        select
            arrayJoin(
                arrayMap(
                    x -> toDateTime(x),
                    range(
                        toUInt32(date_trunc('day', date('2023-12-15'))),
                        toUInt32(date_trunc('day', current_date()))
                    )
                )
            ) as block_date
    ) as d
    cross join (
        select distinct account_id from delegation_updated
    ) as accounts_unique
),

stakers as (
    select
        dim.block_date,
        dim.account_id,
        case
            when coalesce(last_value(delegation_updated.amount) over (
                partition by dim.account_id
                order by dim.block_date
                rows between unbounded preceding and current row
            ), 0) = 0 then 0
            else 1
        end as is_staking
    from dim
    left join delegation_updated on
        dim.block_date = date(delegation_updated.block_timestamp)
        and dim.account_id = delegation_updated.account_id
)

select
    block_date,
    sum(is_staking) as nof_stakers_daily
from stakers
group by block_date
