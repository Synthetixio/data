{{
    config(
        materalized = "view",
        tags = ["analytics", "buyback", "base", "mainnet"],
    )
}}

with agg as (
    select
        date_trunc(
            'hour',
            ts
        ) as ts,
        sum(snx) as snx_amount,
        sum(usd) as usd_amount
    from
        {{ ref('fct_buyback_base_mainnet') }}
    group by
        1
) -- add cumulative amounts

select
    ts,
    snx_amount,
    usd_amount,
    sum(snx_amount) over (
        order by
            ts
    ) as cumulative_snx_amount,
    sum(usd_amount) over (
        order by
            ts
    ) as cumulative_usd_amount
from
    agg