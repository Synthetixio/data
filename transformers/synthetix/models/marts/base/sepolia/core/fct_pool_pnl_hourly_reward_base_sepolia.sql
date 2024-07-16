{{ config(
    materialized = 'table',
    unique_key = ['ts', 'pool_id', 'collateral_type', 'reward_token'],
) }}

WITH dim AS (

    SELECT
        generate_series(DATE_TRUNC('hour', MIN(t.ts)), DATE_TRUNC('hour', MAX(t.ts)), '1 hour' :: INTERVAL) AS ts,
        t.pool_id,
        t.collateral_type,
        t.collateral_value,
        p.token_symbol AS reward_token
    FROM
        (
            SELECT
                ts,
                collateral_type,
                pool_id,
                collateral_value
            FROM
                {{ ref('fct_pool_pnl_hourly_base_sepolia') }}
            group by
                ts,
                collateral_type,
                pool_id,
                collateral_value
        ) AS t
        CROSS JOIN (
            SELECT
                DISTINCT token_symbol
            FROM
                {{ ref('fct_pool_rewards_token_hourly_base_sepolia') }}
        ) AS p
    GROUP BY
        t.pool_id,
        t.collateral_type,
        t.collateral_value,
        p.token_symbol
),
reward_hourly_token AS (
    SELECT
        ts,
        pool_id,
        collateral_type,
        token_symbol AS reward_token,
        SUM(
            rewards_usd
        ) AS rewards_usd
    FROM
        {{ ref('fct_pool_rewards_token_hourly_base_sepolia') }}
    GROUP BY
        ts,
        pool_id,
        collateral_type,
        token_symbol
)
SELECT
    dim.ts,
    dim.pool_id,
    dim.collateral_type,
    dim.collateral_value,
    dim.reward_token,
    COALESCE(
        reward_hourly_token.rewards_usd,
        0
    ) AS rewards_usd,
    CASE
        WHEN dim.collateral_value = 0 THEN 0
        ELSE COALESCE(
            reward_hourly_token.rewards_usd,
            0
        ) / dim.collateral_value
    END AS hourly_rewards_pct
FROM
    dim
    LEFT JOIN reward_hourly_token
    ON dim.ts = reward_hourly_token.ts
    AND dim.pool_id = reward_hourly_token.pool_id
    AND dim.collateral_type = reward_hourly_token.collateral_type
    and dim.reward_token = reward_hourly_token.reward_token
