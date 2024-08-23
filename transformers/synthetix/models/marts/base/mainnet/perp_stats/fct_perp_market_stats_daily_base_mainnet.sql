select
    DATE_TRUNC(
        'day',
        ts
    ) as ts,
    market_symbol,
    SUM(trades) as trades,
    SUM(exchange_fees) as exchange_fees,
    SUM(referral_fees) as referral_fees,
    SUM(collected_fees) as collected_fees,
    SUM(volume) as volume,
    SUM(amount_liquidated) as amount_liquidated,
    SUM(liquidations) as liquidations,
    MAX(cumulative_exchange_fees) as cumulative_exchange_fees,
    MAX(cumulative_referral_fees) as cumulative_referral_fees,
    MAX(cumulative_collected_fees) as cumulative_collected_fees,
    MAX(cumulative_volume) as cumulative_volume
from
    {{ ref('fct_perp_market_stats_hourly_base_mainnet') }}
group by
    ts,
    market_symbol
