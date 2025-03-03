with combined_base as (
    select *
    from
        {{ ref('fct_v2_trades_optimism_mainnet') }}
    union all
    select *
    from
        {{ ref('fct_v2_liquidations_optimism_mainnet') }}
),

all_base as (
    select
        id,
        ts,
        block_number,
        transaction_hash,
        price,
        account,
        market,
        margin,
        trade_size,
        "size",
        last_size,
        skew,
        fee,
        order_type,
        tracking_code
    from
        combined_base
)

select *
from
    all_base
