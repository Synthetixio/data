{{ config(
    materialized = 'table',
    post_hook = [ "create index if not exists idx_ts on {{ this }} (ts)", "create index if not exists idx_market on {{ this }} (market)" ]
) }}

WITH oi_base AS (

    SELECT
        id,
        ts,
        market,
        order_type,
        trade_size,
        price,
        skew,
        CASE
            WHEN last_size > 0 -- long cross
            AND "size" < 0 THEN -1 * last_size
            WHEN last_size < 0 --short cross
            AND "size" > 0 THEN "size"
            WHEN "size" > 0 -- long increase
            AND "size" > last_size THEN (
                "size" - last_size
            )
            WHEN "size" >= 0 -- long decrease
            AND "size" < last_size THEN (
                "size" - last_size
            )
            ELSE 0
        END AS long_oi_change,
        CASE
            WHEN last_size > 0 -- long cross
            AND "size" < 0 THEN "size" * -1
            WHEN last_size < 0 --short cross
            AND "size" > 0 THEN last_size
            WHEN "size" < 0 -- short increase
            AND "size" < last_size THEN (
                last_size - "size"
            )
            WHEN "size" <= 0 -- short decrease
            AND "size" > last_size THEN (
                last_size - "size"
            )
            ELSE 0
        END AS short_oi_change,
        -- get the cumulative sum
        SUM(
            CASE
                WHEN last_size > 0 -- long cross
                AND "size" < 0 THEN -1 * last_size
                WHEN last_size < 0 --short cross
                AND "size" > 0 THEN "size"
                WHEN "size" > 0 -- long increase
                AND "size" > last_size THEN (
                    "size" - last_size
                )
                WHEN "size" >= 0 -- long decrease
                AND "size" < last_size THEN (
                    "size" - last_size
                )
                ELSE 0
            END
        ) over (
            PARTITION BY market
            ORDER BY
                id
        ) AS long_oi,
        SUM(
            CASE
                WHEN last_size > 0 -- long cross
                AND "size" < 0 THEN "size" * -1
                WHEN last_size < 0 --short cross
                AND "size" > 0 THEN last_size
                WHEN "size" < 0 -- short increase
                AND "size" < last_size THEN (
                    last_size - "size"
                )
                WHEN "size" <= 0 -- short decrease
                AND "size" > last_size THEN (
                    last_size - "size"
                )
                ELSE 0
            END
        ) over (
            PARTITION BY market
            ORDER BY
                id
        ) AS short_oi
    FROM
        {{ ref('fct_v2_actions') }}
)
SELECT
    id,
    ts,
    market,
    order_type,
    trade_size,
    price,
    COALESCE(
        skew,
        long_oi - short_oi
    ) AS skew,
    long_oi,
    short_oi,
    CASE
        WHEN (
            long_oi + short_oi
        ) > 0 THEN long_oi / (
            long_oi + short_oi
        )
        ELSE 0
    END AS long_oi_pct,
    CASE
        WHEN (
            long_oi + short_oi
        ) > 0 THEN short_oi / (
            long_oi + short_oi
        )
        ELSE 0
    END AS short_oi_pct,
    long_oi + short_oi AS total_oi,
    long_oi * price AS long_oi_usd,
    short_oi * price AS short_oi_usd,
    (
        long_oi + short_oi
    ) * price AS total_oi_usd
FROM
    oi_base
