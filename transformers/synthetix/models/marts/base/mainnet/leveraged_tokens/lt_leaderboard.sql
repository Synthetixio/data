with actions as (
    select
        id,
        block_number,
        block_timestamp as ts,
        DATE_TRUNC(
            'week',
            block_timestamp + INTERVAL '6 day'
        ) - INTERVAL '6 day' as epoch_start,
        "caller" as account, -- noqa
        {{ convert_wei('base_asset_amount') }} * CAST(
            REGEXP_REPLACE(
                token,
                '.*_(long|short)',
                ''
            ) as INT
        ) as volume,
        {{ convert_wei('base_asset_amount') }} * CAST(
            REGEXP_REPLACE(
                token,
                '.*_(long|short)',
                ''
            ) as INT
        ) * 0.003 as fees_paid
    from
        {{ ref('lt_redeemed_base_mainnet') }}

    union all

    select
        id,
        block_number,
        block_timestamp as ts,
        DATE_TRUNC(
            'week',
            block_timestamp + INTERVAL '6 day'
        ) - INTERVAL '6 day' as epoch_start,
        recipient as account,
        {{ convert_wei('base_asset_amount') }} * CAST(
            REGEXP_REPLACE(
                token,
                '.*_(long|short)',
                ''
            ) as INT
        ) as volume,
        0 as fees_paid
    from
        {{ ref('lt_minted_base_mainnet') }}
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
        ) as "rank", -- DEPRECATED
        RANK() over (
            partition by epoch_start
            order by
                total_fees_paid desc
        ) as fees_rank,
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
    volume_rank
