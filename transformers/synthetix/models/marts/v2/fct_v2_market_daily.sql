WITH aggregated_data AS (
    SELECT
        DATE_TRUNC(
            'day',
            ts
        ) AS ts,
        market,
        MAX(id) AS max_id,
        SUM(exchange_fees) AS exchange_fees,
        SUM(liquidation_fees) AS liquidation_fees,
        SUM(volume) AS volume,
        SUM(amount_liquidated) AS amount_liquidated,
        SUM(trades) AS trades,
        SUM(liquidations) AS liquidations
    FROM
        {{ ref('fct_v2_market_stats') }}
    GROUP BY
        1,
        2
)
SELECT
    A.ts,
    A.market,
    A.exchange_fees,
    A.liquidation_fees,
    A.volume,
    A.amount_liquidated,
    A.trades,
    A.liquidations,
    b.long_oi_usd,
    b.short_oi_usd,
    b.total_oi_usd,
    b.cumulative_exchange_fees,
    b.cumulative_liquidation_fees,
    b.cumulative_volume,
    b.cumulative_amount_liquidated,
    b.cumulative_trades,
    b.cumulative_liquidations
FROM
    aggregated_data A
    JOIN {{ ref('fct_v2_market_stats') }}
    b
    ON A.max_id = b.id
