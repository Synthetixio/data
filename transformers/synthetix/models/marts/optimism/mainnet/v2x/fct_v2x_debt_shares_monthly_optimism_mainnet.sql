WITH all_events AS (
    SELECT
        block_timestamp,
        account,
        amount
    FROM {{ ref('v2x_synthetix_debt_share_mint_optimism_mainnet') }}
    
    UNION ALL
    
    SELECT
        block_timestamp,
        account,
        -amount
    FROM {{ ref('v2x_synthetix_debt_share_burn_optimism_mainnet') }}
),

monthly_data AS (
    SELECT DISTINCT
        DATE_TRUNC('month', block_timestamp) AS month,
        SUM(amount) AS current_amount
    FROM all_events
    GROUP BY month
),

monthly_data_rolling AS (
    SELECT DISTINCT
        month,
        SUM(current_amount) OVER (ORDER BY month) AS current_amount
    FROM monthly_data
)

SELECT 
    month,
    current_amount
FROM monthly_data_rolling
