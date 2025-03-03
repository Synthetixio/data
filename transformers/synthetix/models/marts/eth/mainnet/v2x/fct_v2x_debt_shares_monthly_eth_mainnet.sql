WITH all_events AS (
    SELECT
        block_timestamp,
        account,
        amount
    FROM {{ ref('v2x_synthetix_debt_share_mint_eth_mainnet') }}
    
    UNION ALL
    
    SELECT
        block_timestamp,
        account,
        -amount
    FROM {{ ref('v2x_synthetix_debt_share_burn_eth_mainnet') }}
),

monthly_data AS (
    SELECT DISTINCT
        DATE_TRUNC('month', block_timestamp) AS month,
        SUM(amount) AS debt_shares
    FROM all_events
    GROUP BY month
),

monthly_data_rolling AS (
    SELECT DISTINCT
        month,
        SUM(debt_shares) OVER (ORDER BY month) AS debt_shares
    FROM monthly_data
)

SELECT 
    month,
    debt_shares
FROM monthly_data_rolling
