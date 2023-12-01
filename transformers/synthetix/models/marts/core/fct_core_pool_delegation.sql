WITH delegation_changes AS (
    SELECT
        block_timestamp,
        account_id,
        pool_id,
        collateral_type,
        {{ convert_wei('amount') }} - LAG({{ convert_wei('amount') }}, 1, 0) OVER (PARTITION BY account_id, pool_id, collateral_type ORDER BY block_timestamp) AS change_in_amount
    FROM {{ ref('core_delegation_updated') }}
),
cumulative_delegation AS (
    SELECT
        block_timestamp,
        pool_id,
        collateral_type,
        SUM(change_in_amount) OVER (PARTITION BY pool_id, collateral_type ORDER BY block_timestamp) AS cumulative_amount_delegated
    FROM delegation_changes
)

SELECT 
    block_timestamp as ts,
    pool_id,
    collateral_type,
    cumulative_amount_delegated as amount_delegated
FROM cumulative_delegation
ORDER BY block_timestamp, collateral_type