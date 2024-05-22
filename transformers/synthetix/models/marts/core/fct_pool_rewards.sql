WITH rewards_distributed AS (
    SELECT
        block_timestamp AS ts,
        CAST(
            pool_id AS INTEGER
        ) AS pool_id,
        collateral_type,
        distributor,
        {{ get_reward_distributor_token('distributor') }} AS market_symbol,
        {{ convert_wei('amount') }} AS amount,
        TO_TIMESTAMP("start") AS ts_start,
        "duration"
    FROM
        {{ ref('core_rewards_distributed') }}
)
SELECT
    ts,
    pool_id,
    collateral_type,
    distributor,
    market_symbol,
    amount,
    ts_start,
    "duration"
FROM
    rewards_distributed
ORDER BY
    ts
