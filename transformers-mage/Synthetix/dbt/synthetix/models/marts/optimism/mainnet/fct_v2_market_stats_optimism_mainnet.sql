{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_ts on {{ this }} (ts)", "create index if not exists idx_market on {{ this }} (market)"]
) }}

with trades as (
    select
        id,
        ts,
        block_number,
        market,
        fee as exchange_fees,
        0 as liquidation_fees,
        0 as amount_liquidated,
        1 as trades,
        0 as liquidations,
        tracking_code,
        price * ABS(trade_size) as volume
    from
        {{ ref(
            'fct_v2_actions_optimism_mainnet'
        ) }}
    where
        order_type = 'trade'
),

liquidations as (
    select
        id,
        ts,
        block_number,
        market,
        0 as exchange_fees,
        fee as liquidation_fees,
        price * ABS(trade_size) as amount_liquidated,
        0 as trades,
        1 as liquidations,
        tracking_code,
        0 as volume
    from
        {{ ref(
            'fct_v2_actions_optimism_mainnet'
        ) }}
    where
        order_type = 'liquidation'
),

actions as (
    select *
    from
        trades
    union all
    select *
    from
        liquidations
),

oi as (
    select
        id,
        ts,
        market,
        skew,
        long_oi,
        short_oi,
        long_oi_pct,
        short_oi_pct,
        total_oi,
        long_oi_usd,
        short_oi_usd,
        total_oi_usd
    from
        {{ ref(
            'fct_v2_open_interest_optimism_mainnet'
        ) }}

    {% if is_incremental() %}
        where
            id > (
                select MAX(id) as max_id
                from
                    {{ this }}
            )
    {% endif %}
),

market_stats as (
    select
        actions.ts,
        actions.id,
        actions.market,
        actions.block_number,
        funding.funding_rate,
        actions.exchange_fees,
        actions.liquidation_fees,
        actions.volume,
        actions.amount_liquidated,
        actions.trades,
        actions.liquidations,
        actions.tracking_code,
        oi.skew,
        oi.long_oi,
        oi.short_oi,
        oi.total_oi,
        oi.long_oi_usd,
        oi.short_oi_usd,
        oi.total_oi_usd,
        oi.long_oi_pct,
        oi.short_oi_pct,
        SUM(
            actions.exchange_fees
        ) over (
            partition by actions.market
            order by
                actions.id
        ) as cumulative_exchange_fees,
        SUM(
            actions.liquidation_fees
        ) over (
            partition by actions.market
            order by
                actions.id
        ) as cumulative_liquidation_fees,
        SUM(
            actions.volume
        ) over (
            partition by actions.market
            order by
                actions.id
        ) as cumulative_volume,
        SUM(
            actions.amount_liquidated
        ) over (
            partition by actions.market
            order by
                actions.id
        ) as cumulative_amount_liquidated,
        SUM(
            actions.trades
        ) over (
            partition by actions.market
            order by
                actions.id
        ) as cumulative_trades,
        SUM(
            actions.liquidations
        ) over (
            partition by actions.market
            order by
                actions.id
        ) as cumulative_liquidations
    from
        actions
    left join oi
        on actions.id = oi.id
    left join {{ ref('fct_v2_funding_optimism_mainnet') }} as funding
        on
            actions.block_number = funding.block_number
            and actions.market = funding.market
)

select *
from
    market_stats

{% if is_incremental() %}
    where
        id > (
            select MAX(id) as max_id
            from
                {{ this }}
        )
{% endif %}
