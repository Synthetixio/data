with
zap_accounts as (
    select distinct
        transaction_hash,
        account
    from
        {{ ref('tlx_lt_zap_swaps_optimism_mainnet') }}
),

actions as (
    select
        block_timestamp as ts,
        DATE_TRUNC(
            'week',
            block_timestamp + INTERVAL '6 day'
        ) - INTERVAL '6 day' as epoch_start,
        COALESCE(z.account, r.account) as account,
        {{ convert_wei('leveraged_token_amount') }} * CAST(
            REGEXP_REPLACE(
                token,
                '.*_(long|short)',
                ''
            ) as INT
        ) as volume,
        {{ convert_wei('leveraged_token_amount') }} * CAST(
            REGEXP_REPLACE(
                token,
                '.*_(long|short)',
                ''
            ) as INT
        ) * 0.003 as fees_paid
    from
        {{ ref('tlx_lt_redeemed_optimism_mainnet') }} as r
    left join zap_accounts as z on r.transaction_hash = z.transaction_hash

    union all

    select
        block_timestamp as ts,
        DATE_TRUNC(
            'week',
            block_timestamp + INTERVAL '6 day'
        ) - INTERVAL '6 day' as epoch_start,
        COALESCE(z.account, m.account) as account,
        {{ convert_wei('leveraged_token_amount') }} * CAST(
            REGEXP_REPLACE(
                token,
                '.*_(long|short)',
                ''
            ) as INT
        ) as volume,
        0 as fees_paid
    from
        {{ ref('tlx_lt_minted_optimism_mainnet') }} as m
    left join zap_accounts as z on m.transaction_hash = z.transaction_hash
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
    epoch_start desc,
    volume_rank asc
