WITH aggregated_data AS (
    SELECT
        DATE_TRUNC(
            'day',
            ts
        ) AS ts,
        tracking_code,
        SUM(exchange_fees) AS exchange_fees,
        SUM(volume) AS volume,
        SUM(trades) AS trades
    FROM
        {{ ref('fct_v2_market_stats') }}
    GROUP BY
        1,
        2
),
date_series AS (
    SELECT
        q.ts,
        q2.tracking_code
    FROM
        (
            SELECT
                generate_series(MIN(DATE_TRUNC('day', ts)), MAX(DATE_TRUNC('day', ts)), '1 day' :: INTERVAL) AS ts
            FROM
                aggregated_data
        ) AS q
        CROSS JOIN (
            SELECT
                DISTINCT tracking_code
            FROM
                aggregated_data
        ) AS q2
),
traders AS (
    SELECT
        ds.ts,
        ds.tracking_code,
        COALESCE(COUNT(DISTINCT account), 0) AS traders
    FROM
        date_series ds
        LEFT JOIN {{ ref('fct_v2_actions') }}
        ad
        ON ds.ts = DATE_TRUNC(
            'day',
            ad.ts
        )
        AND ds.tracking_code = ad.tracking_code
    GROUP BY
        1,
        2
),
complete_data AS (
    SELECT
        ds.ts,
        ds.tracking_code,
        COALESCE(
            ad.exchange_fees,
            0
        ) AS exchange_fees,
        COALESCE(
            ad.volume,
            0
        ) AS volume,
        COALESCE(
            ad.trades,
            0
        ) AS trades,
        t.traders
    FROM
        date_series ds
        LEFT JOIN aggregated_data ad
        ON ds.ts = ad.ts
        AND ds.tracking_code = ad.tracking_code
        LEFT JOIN traders t
        ON ds.ts = t.ts
        AND ds.tracking_code = t.tracking_code
)
SELECT
    ts,
    tracking_code,
    exchange_fees,
    volume,
    trades,
    traders,
    SUM(exchange_fees) over (
        PARTITION BY tracking_code
        ORDER BY
            ts
    ) AS cumulative_exchange_fees,
    SUM(volume) over (
        PARTITION BY tracking_code
        ORDER BY
            ts
    ) AS cumulative_volume,
    SUM(trades) over (
        PARTITION BY tracking_code
        ORDER BY
            ts
    ) AS cumulative_trades
FROM
    complete_data
