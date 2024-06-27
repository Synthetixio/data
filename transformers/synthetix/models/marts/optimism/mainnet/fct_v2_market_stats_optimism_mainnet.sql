{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_ts on {{ this }} (ts)", "create index if not exists idx_market on {{ this }} (market)"]
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
            'fct_v2_actions_optimism_mainnet'
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
            'fct_v2_actions_optimism_mainnet'
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
            'fct_v2_open_interest_optimism_mainnet'
        ) }}

{% if is_incremental() %}
WHERE
    id > (
        SELECT
            MAX(id)
        FROM
            {{ this }}
    )
{% endif %}
),
market_stats AS (
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
        LEFT JOIN oi
        ON actions.id = oi.id
        LEFT JOIN {{ ref('fct_v2_funding_optimism_mainnet') }} AS funding
        ON actions.block_number = funding.block_number
        AND actions.market = funding.market
)
SELECT
    *
FROM
    market_stats

{% if is_incremental() %}
WHERE
    id > (
        SELECT
            MAX(id)
        FROM
            {{ this }}
    )
{% endif %}
