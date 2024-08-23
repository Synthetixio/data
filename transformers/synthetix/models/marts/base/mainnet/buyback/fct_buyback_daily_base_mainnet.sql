with agg as (
    select
        DATE_TRUNC(
            'day',
            ts
        ) as ts,
        SUM(snx) as snx_amount,
        SUM(usd) as usd_amount
    from
        {{ ref('fct_buyback_base_mainnet') }}
    group by
        1
) -- add cumulative amounts

select
    ts,
    snx_amount,
    usd_amount,
    SUM(snx_amount) over (
        order by
            ts
    ) as cumulative_snx_amount,
    SUM(usd_amount) over (
        order by
            ts
    ) as cumulative_usd_amount
from
    agg
