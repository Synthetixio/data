WITH trades AS (
    SELECT
        DATE_TRUNC(
            'hour',
            ts
        ) AS ts,
        market,
        SUM(fee) AS exchange_fees,
        SUM(price * ABS(trade_size)) AS volume,
        COUNT(*) AS trades
    FROM
        {{ ref(
            'fct_v2_actions'
        ) }}
    WHERE
        order_type = 'trade'
    GROUP BY
        1,
        2
)
SELECT
    ts,
    market,
    exchange_fees,
    volume,
    trades,
    SUM(exchange_fees) over (
        PARTITION BY market
        ORDER BY
            ts
    ) AS cumulative_exchange_fees,
    SUM(volume) over (
        PARTITION BY market
        ORDER BY
            ts
    ) AS cumulative_volume,
    SUM(trades) over (
        PARTITION BY market
        ORDER BY
            ts
    ) AS cumulative_trades
FROM
    trades
