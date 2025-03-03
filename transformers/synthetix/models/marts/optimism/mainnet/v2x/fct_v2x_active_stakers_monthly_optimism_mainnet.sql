WITH all_events AS (
    SELECT
        block_timestamp,
        block_number,
        transaction_hash,
        account,
        amount
    FROM {{ ref('v2x_synthetix_debt_share_mint_optimism_mainnet') }}
    
    UNION ALL
    
    SELECT
        block_timestamp,
        block_number,
        transaction_hash,
        account,
        -amount
    FROM {{ ref('v2x_synthetix_debt_share_burn_optimism_mainnet') }}
),

monthly_balances AS (
    SELECT
        DATE_TRUNC('month', block_timestamp) AS month,
        account,
        SUM(amount) AS monthly_change
    FROM all_events
    GROUP BY 1, 2
),

month_series AS (
    SELECT generate_series(
        (SELECT MIN(month) FROM monthly_balances),
        (SELECT MAX(month) FROM monthly_balances),
        interval '1 month'
    ) AS month
),

account_month_combinations AS (
    SELECT
        m.month,
        a.account
    FROM month_series m
    CROSS JOIN (SELECT DISTINCT account FROM monthly_balances) a
),

monthly_account_data AS (
    SELECT
        amc.month,
        amc.account,
        COALESCE(mb.monthly_change, 0) AS monthly_change
    FROM account_month_combinations amc
    LEFT JOIN monthly_balances mb ON amc.month = mb.month AND amc.account = mb.account
),

cumulative_balances AS (
    SELECT
        month,
        account,
        SUM(monthly_change) OVER (PARTITION BY account ORDER BY month) AS balance
    FROM monthly_account_data
),

active_stakers_monthly AS (
    SELECT
        month,
        COUNT(DISTINCT CASE WHEN balance > 0 THEN account END) AS active_stakers
    FROM cumulative_balances
    GROUP BY month
)

SELECT 
    month,
    active_stakers
FROM active_stakers_monthly
ORDER BY month
