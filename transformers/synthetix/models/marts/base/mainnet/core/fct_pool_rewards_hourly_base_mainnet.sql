WITH token_hourly AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        rewards_usd
    FROM
        {{ ref('fct_pool_rewards_token_hourly_base_mainnet') }}
)
SELECT
    ts,
    pool_id,
    collateral_type,
    SUM(rewards_usd) AS rewards_usd
FROM
    token_hourly
GROUP BY
    ts,
    pool_id,
    collateral_type
