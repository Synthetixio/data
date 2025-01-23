with actions as (
    select
        id,
        block_number,
        block_timestamp as ts,
        DATE_TRUNC(
            'week',
            block_timestamp + INTERVAL '6 day'
        ) - INTERVAL '6 day' as epoch_start,
        account,
        {{ convert_wei('base_asset_amount') }} as volume,
        {{ convert_wei('leveraged_token_amount') }} * CAST(
            REGEXP_REPLACE(
                token,
                '.*_(long|short)',
                ''
            ) as INT
        ) * 0.003 as fees_paid
    from
        {{ ref('tlx_lt_redeemed_optimism_mainnet') }}

    union all

    select
        id,
        block_number,
        block_timestamp as ts,
        DATE_TRUNC(
            'week',
            block_timestamp + INTERVAL '6 day'
        ) - INTERVAL '6 day' as epoch_start,
        account,
        {{ convert_wei('base_asset_amount') }} as volume,
        0 as fees_paid
    from
        {{ ref('tlx_lt_minted_optimism_mainnet') }}
),

epoch_summary as (
    select
        account,
        epoch_start,
        SUM(
            volume
        ) as volume,
        SUM(
            fees_paid
        ) as total_fees_paid
    from
        actions
    group by
        account,
        epoch_start
),

ranked_table as (
    select
        account,
        epoch_start,
        volume,
        total_fees_paid,
        total_fees_paid / SUM(total_fees_paid) over (
            partition by epoch_start
        ) as fees_paid_pct,
        volume / SUM(volume) over (
            partition by epoch_start
        ) as volume_pct,
        RANK() over (
            partition by epoch_start
            order by
                total_fees_paid desc
        ) as "rank",
        RANK() over (
            partition by epoch_start
            order by
                volume desc
        ) as volume_rank
    from
        epoch_summary
)

select *
from
    ranked_table
order by
    epoch_start,
    "rank"
