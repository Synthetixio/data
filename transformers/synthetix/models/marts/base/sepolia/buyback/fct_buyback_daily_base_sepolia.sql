WITH agg AS (
    SELECT
        DATE_TRUNC(
            'day',
            ts
        ) AS ts,
        SUM(snx) AS snx_amount,
        SUM(usd) AS usd_amount
    FROM
        {{ ref('fct_buyback_base_sepolia') }}
    GROUP BY
        1
) -- add cumulative amounts
SELECT
    ts,
    snx_amount,
    usd_amount,
    SUM(snx_amount) over (
        ORDER BY
            ts
    ) AS cumulative_snx_amount,
    SUM(usd_amount) over (
        ORDER BY
            ts
    ) AS cumulative_usd_amount
FROM
    agg
