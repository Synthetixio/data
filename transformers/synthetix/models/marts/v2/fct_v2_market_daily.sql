WITH raw_data AS (
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
),
aggregated_data AS (
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
        raw_data A
        JOIN {{ ref('fct_v2_market_stats') }}
        b
        ON A.max_id = b.id
),
date_series AS (
    SELECT
        q.ts,
        q2.market
    FROM
        (
            SELECT
                generate_series(MIN(DATE_TRUNC('day', ts)), MAX(DATE_TRUNC('day', ts)), '1 day' :: INTERVAL) AS ts
            FROM
                aggregated_data
        ) AS q
        CROSS JOIN (
            SELECT
                DISTINCT market
            FROM
                aggregated_data
        ) AS q2
),
gap_data AS (
    SELECT
        ds.ts,
        ds.market,
        COALESCE(
            ad.exchange_fees,
            0
        ) AS exchange_fees,
        COALESCE(
            ad.liquidation_fees,
            0
        ) AS liquidation_fees,
        COALESCE(
            ad.volume,
            0
        ) AS volume,
        COALESCE(
            ad.amount_liquidated,
            0
        ) AS amount_liquidated,
        COALESCE(
            ad.trades,
            0
        ) AS trades,
        COALESCE(
            ad.liquidations,
            0
        ) AS liquidations,
        ad.long_oi_usd,
        ad.short_oi_usd,
        ad.total_oi_usd,
        ad.cumulative_exchange_fees,
        ad.cumulative_liquidation_fees,
        ad.cumulative_volume,
        ad.cumulative_amount_liquidated,
        ad.cumulative_trades,
        ad.cumulative_liquidations
    FROM
        date_series ds
        LEFT JOIN aggregated_data ad
        ON ds.ts = ad.ts
        AND ds.market = ad.market
),
agg_data AS (
    SELECT
        ts,
        market,
        FIRST_VALUE(long_oi_usd) over (
            PARTITION BY market,
            value_partition
            ORDER BY
                ts
        ) long_oi_usd,
        FIRST_VALUE(short_oi_usd) over (
            PARTITION BY market,
            value_partition
            ORDER BY
                ts
        ) short_oi_usd,
        FIRST_VALUE(total_oi_usd) over (
            PARTITION BY market,
            value_partition
            ORDER BY
                ts
        ) total_oi_usd,
        FIRST_VALUE(cumulative_exchange_fees) over (
            PARTITION BY market,
            value_partition
            ORDER BY
                ts
        ) cumulative_exchange_fees,
        FIRST_VALUE(cumulative_liquidation_fees) over (
            PARTITION BY market,
            value_partition
            ORDER BY
                ts
        ) cumulative_liquidation_fees,
        FIRST_VALUE(cumulative_volume) over (
            PARTITION BY market,
            value_partition
            ORDER BY
                ts
        ) cumulative_volume,
        FIRST_VALUE(cumulative_amount_liquidated) over (
            PARTITION BY market,
            value_partition
            ORDER BY
                ts
        ) cumulative_amount_liquidated,
        FIRST_VALUE(cumulative_trades) over (
            PARTITION BY market,
            value_partition
            ORDER BY
                ts
        ) cumulative_trades,
        FIRST_VALUE(cumulative_liquidations) over (
            PARTITION BY market,
            value_partition
            ORDER BY
                ts
        ) cumulative_liquidations
    FROM
        (
            SELECT
                ts,
                market,
                long_oi_usd,
                short_oi_usd,
                total_oi_usd,
                cumulative_exchange_fees,
                cumulative_liquidation_fees,
                cumulative_volume,
                cumulative_amount_liquidated,
                cumulative_trades,
                cumulative_liquidations,
                COUNT(long_oi_usd) over (
                    PARTITION BY market
                    ORDER BY
                        ts
                ) AS value_partition
            FROM
                gap_data
        ) AS q
)
SELECT
    gap_data.ts,
    gap_data.market,
    gap_data.exchange_fees,
    gap_data.liquidation_fees,
    gap_data.volume,
    gap_data.amount_liquidated,
    gap_data.trades,
    gap_data.liquidations,
    agg_data.long_oi_usd,
    agg_data.short_oi_usd,
    agg_data.total_oi_usd,
    agg_data.cumulative_exchange_fees,
    agg_data.cumulative_liquidation_fees,
    agg_data.cumulative_volume,
    agg_data.cumulative_amount_liquidated,
    agg_data.cumulative_trades,
    agg_data.cumulative_liquidations
FROM
    gap_data
    JOIN agg_data USING (
        ts,
        market
    )
