with redemptions as (
    select
        id,
        block_number,
        block_timestamp as ts,
        DATE_TRUNC(
            'week',
            block_timestamp + INTERVAL '6 day'
        ) - INTERVAL '6 day' as epoch_start,
        "caller" as account, -- noqa
        {{ convert_wei('leveraged_token_amount') }} * CAST(
            REGEXP_REPLACE(
                token,
                '.*_(long|short)',
                ''
            ) as INT
        ) * 0.003 as fees_paid
    from
        {{ ref('lt_redeemed_base_mainnet') }}
),

epoch_summary as (
    select
        account,
        epoch_start,
        SUM(
            fees_paid
        ) as total_fees_paid
    from
        redemptions
    group by
        account,
        epoch_start
),

ranked_fees as (
    select
        account,
        epoch_start,
        total_fees_paid,
        total_fees_paid / SUM(total_fees_paid) over (
            partition by epoch_start
        ) as fees_paid_pct,
        RANK() over (
            partition by epoch_start
            order by
                total_fees_paid desc
        ) as "rank"
    from
        epoch_summary
)

select *
from
    ranked_fees
order by
    epoch_start,
    "rank"
