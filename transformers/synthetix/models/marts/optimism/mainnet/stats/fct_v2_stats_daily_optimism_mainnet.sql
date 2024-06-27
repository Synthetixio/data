SELECT
    ts,
    SUM(
        exchange_fees
    ) AS exchange_fees,
    SUM(
        liquidation_fees
    ) AS liquidation_fees,
    SUM(
        volume
    ) AS volume,
    SUM(
        amount_liquidated
    ) AS amount_liquidated,
    SUM(
        trades
    ) AS trades,
    SUM(
        liquidations
    ) AS liquidations,
    SUM(
        long_oi_usd
    ) AS long_oi_usd,
    SUM(
        short_oi_usd
    ) AS short_oi_usd,
    SUM(
        total_oi_usd
    ) AS total_oi_usd,
    SUM(
        CASE
            WHEN market IN (
                'ETH',
                'BTC'
            ) THEN total_oi_usd
            ELSE 0
        END
    ) AS eth_btc_oi_usd,
    SUM(
        CASE
            WHEN market NOT IN (
                'ETH',
                'BTC'
            ) THEN total_oi_usd
            ELSE 0
        END
    ) AS alt_oi_usd,
    SUM(
        cumulative_exchange_fees
    ) AS cumulative_exchange_fees,
    SUM(
        cumulative_liquidation_fees
    ) AS cumulative_liquidation_fees,
    SUM(
        cumulative_volume
    ) AS cumulative_volume,
    SUM(
        cumulative_amount_liquidated
    ) AS cumulative_amount_liquidated,
    SUM(
        cumulative_trades
    ) AS cumulative_trades,
    SUM(
        cumulative_liquidations
    ) AS cumulative_liquidations
FROM
    {{ ref('fct_v2_market_daily_optimism_mainnet') }}
GROUP BY
    1
