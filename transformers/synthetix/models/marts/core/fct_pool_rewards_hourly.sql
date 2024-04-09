WITH token_hourly AS (
    SELECT
        ts,
        market_id,
        pool_id,
        collateral_type,
        rewards_usd
    FROM
        {{ ref('fct_pool_rewards_token_hourly') }}
)
SELECT
    ts,
    market_id,
    pool_id,
    collateral_type,
    SUM(rewards_usd) AS rewards_usd
FROM
    token_hourly
GROUP BY
    ts,
    market_id,
    pool_id,
    collateral_type
