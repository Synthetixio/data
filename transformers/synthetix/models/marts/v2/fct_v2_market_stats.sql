WITH trades AS (
    SELECT
        id,
        ts,
        market,
        fee AS exchange_fees,
        price * ABS(trade_size) AS volume,
        1 AS trades,
        SUM(fee) over (
            PARTITION BY market
            ORDER BY
                id
        ) AS cumulative_exchange_fees,
        SUM(price * ABS(trade_size)) over (
            PARTITION BY market
            ORDER BY
                id
        ) AS cumulative_volume,
        SUM(1) over (
            PARTITION BY market
            ORDER BY
                id
        ) AS cumulative_trades
    FROM
        {{ ref(
            'fct_v2_actions'
        ) }}
    WHERE
        order_type = 'trade'
),
oi AS (
    SELECT
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
    FROM
        {{ ref(
            'fct_v2_open_interest'
        ) }}
)
SELECT
    trades.ts,
    trades.id,
    trades.market,
    trades.exchange_fees,
    trades.volume,
    trades.trades,
    trades.cumulative_exchange_fees,
    trades.cumulative_volume,
    trades.cumulative_trades,
    oi.skew,
    oi.long_oi,
    oi.short_oi,
    oi.total_oi,
    oi.long_oi_usd,
    oi.short_oi_usd,
    oi.total_oi_usd,
    oi.long_oi_pct,
    oi.short_oi_pct
FROM
    trades
    JOIN oi
    ON trades.id = oi.id
