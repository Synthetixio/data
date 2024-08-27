{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)"]
) }}

with order_submit as (
    select
        block_timestamp,
        contract,
        account,
        tracking_code
    from
        {{ ref('v2_perp_delayed_order_submitted_optimism_mainnet') }}
),

position_modified as (
    select
        id,
        block_number,
        contract,
        account,
        block_timestamp
    from
        {{ ref('v2_perp_position_modified_optimism_mainnet') }}
    where
        trade_size != 0

        {% if is_incremental() %}
            and block_number > (
                select COALESCE(MAX(block_number), 0) as b
                from
                    {{ this }}
            )
        {% endif %}
),

combined as (
    select
        position_modified.id,
        position_modified.block_number,
        order_submit.tracking_code,
        ROW_NUMBER() over (
            partition by
                position_modified.contract,
                position_modified.account,
                position_modified.id
            order by
                order_submit.block_timestamp desc
        ) as rn
    from
        position_modified
    inner join order_submit
        on
            position_modified.contract = order_submit.contract
            and position_modified.account = order_submit.account
            and
            position_modified.block_timestamp
            between
            order_submit.block_timestamp
            and order_submit.block_timestamp + interval '5' minute
)

select
    id,
    block_number,
    tracking_code
from
    combined
where
    rn = 1
