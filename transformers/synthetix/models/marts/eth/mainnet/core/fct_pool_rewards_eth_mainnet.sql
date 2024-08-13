WITH rewards_distributed AS (
    SELECT
        block_timestamp AS ts,
        CAST(
            pool_id AS INTEGER
        ) AS pool_id,
        collateral_type,
        distributor,
        {{ convert_wei('amount') }} AS amount,
        TO_TIMESTAMP("start") AS ts_start,
        "duration"
    FROM
        {{ ref('core_rewards_distributed_eth_mainnet') }}
),
distributors AS (
    SELECT
        CAST(distributor_address AS TEXT) AS distributor_address,
        CAST(token_symbol AS TEXT) AS token_symbol
    FROM
        {{ ref('eth_mainnet_reward_distributors') }}
)
SELECT
    rd.ts,
    rd.pool_id,
    rd.collateral_type,
    rd.distributor,
    distributors.token_symbol,
    rd.amount,
    rd.ts_start,
    rd.duration
FROM
    rewards_distributed rd
    join distributors on rd.distributor = distributors.distributor_address
ORDER BY
    ts
