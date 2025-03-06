{{
    config(
        materialized='table'
    )
}}

select
    ts,
    SUM(
        exchange_fees
    ) as exchange_fees,
    SUM(
        liquidation_fees
    ) as liquidation_fees,
    SUM(
        volume
    ) as volume,
    SUM(
        amount_liquidated
    ) as amount_liquidated,
    SUM(
        trades
    ) as trades,
    SUM(
        liquidations
    ) as liquidations,
    SUM(
        long_oi_usd
    ) as long_oi_usd,
    SUM(
        short_oi_usd
    ) as short_oi_usd,
    SUM(
        total_oi_usd
    ) as total_oi_usd,
    SUM(
        case
            when market in (
                'ETH',
                'BTC'
            ) then total_oi_usd
            else 0
        end
    ) as eth_btc_oi_usd,
    SUM(
        case
            when market not in (
                'ETH',
                'BTC'
            ) then total_oi_usd
            else 0
        end
    ) as alt_oi_usd,
    SUM(
        cumulative_exchange_fees
    ) as cumulative_exchange_fees,
    SUM(
        cumulative_liquidation_fees
    ) as cumulative_liquidation_fees,
    SUM(
        cumulative_volume
    ) as cumulative_volume,
    SUM(
        cumulative_amount_liquidated
    ) as cumulative_amount_liquidated,
    SUM(
        cumulative_trades
    ) as cumulative_trades,
    SUM(
        cumulative_liquidations
    ) as cumulative_liquidations
from
    {{ ref('fct_v2_market_hourly_optimism_mainnet') }}
group by
    ts
