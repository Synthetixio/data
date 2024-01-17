WITH delegation_changes AS (
    SELECT
        block_timestamp,
        account_id,
        pool_id,
        collateral_type,
        {{ convert_wei('amount') }} - LAG({{ convert_wei('amount') }}, 1, 0) over (
            PARTITION BY account_id,
            pool_id,
            collateral_type
            ORDER BY
                block_timestamp
        ) AS change_in_amount
    FROM
        {{ ref('core_delegation_updated') }}
),
cumulative_delegation AS (
    SELECT
        block_timestamp,
        account_id,
        pool_id,
        collateral_type,
        SUM(change_in_amount) over (
            PARTITION BY pool_id,
            account_id,
            collateral_type
            ORDER BY
                block_timestamp
        ) AS cumulative_amount_delegated,
        ROW_NUMBER() over (
            PARTITION BY pool_id,
            account_id,
            collateral_type
            ORDER BY
                block_timestamp DESC
        ) AS rn
    FROM
        delegation_changes
)
SELECT
    block_timestamp AS ts,
    CAST(
        account_id AS text
    ) AS account_id,
    pool_id,
    collateral_type,
    cumulative_amount_delegated AS amount_delegated
FROM
    cumulative_delegation
WHERE
    rn = 1
ORDER BY
    block_timestamp,
    collateral_type
