{{ config(
    materialized = 'table',
) }}

WITH trades AS (

    SELECT
        id,
        ts,
        block_number,
        market,
        fee AS exchange_fees,
        0 AS liquidation_fees,
        price * ABS(trade_size) AS volume,
        0 AS amount_liquidated,
        1 AS trades,
        0 AS liquidations,
        tracking_code
    FROM
        {{ ref(
            'fct_v2_actions'
        ) }}
    WHERE
        order_type = 'trade'
),
liquidations AS (
    SELECT
        id,
        ts,
        block_number,
        market,
        0 AS exchange_fees,
        fee AS liquidation_fees,
        0 AS volume,
        price * ABS(trade_size) AS amount_liquidated,
        0 AS trades,
        1 AS liquidations,
        tracking_code
    FROM
        {{ ref(
            'fct_v2_actions'
        ) }}
    WHERE
        order_type = 'liquidation'
),
actions AS (
    SELECT
        *
    FROM
        trades
    UNION ALL
    SELECT
        *
    FROM
        liquidations
),
funding AS (
    SELECT
        block_number,
        market,
        {{ convert_wei('funding_rate') }} AS funding_rate
    FROM
        (
            SELECT
                block_number,
                market,
                funding_rate,
                ROW_NUMBER() over (
                    PARTITION BY block_number,
                    market
                    ORDER BY
                        id DESC
                ) AS rn
            FROM
                {{ ref(
                    'v2_perp_funding_recomputed'
                ) }}
        ) AS subquery
    WHERE
        rn = 1
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
        PARTITION BY actions.market
        ORDER BY
            actions.id
    ) AS cumulative_exchange_fees,
    SUM(
        actions.liquidation_fees
    ) over (
        PARTITION BY actions.market
        ORDER BY
            actions.id
    ) AS cumulative_liquidation_fees,
    SUM(
        actions.volume
    ) over (
        PARTITION BY actions.market
        ORDER BY
            actions.id
    ) AS cumulative_volume,
    SUM(
        actions.amount_liquidated
    ) over (
        PARTITION BY actions.market
        ORDER BY
            actions.id
    ) AS cumulative_amount_liquidated,
    SUM(
        actions.trades
    ) over (
        PARTITION BY actions.market
        ORDER BY
            actions.id
    ) AS cumulative_trades,
    SUM(
        actions.liquidations
    ) over (
        PARTITION BY actions.market
        ORDER BY
            actions.id
    ) AS cumulative_liquidations
FROM
    actions
    JOIN oi
    ON actions.id = oi.id
    JOIN funding
    ON actions.block_number = funding.block_number
    AND actions.market = funding.market
