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
        {{ ref('core_rewards_distributed') }}
)
SELECT
    rd.ts,
    rd.pool_id,
    rd.collateral_type,
    rd.distributor,
    dist.token_symbol,
    rd.amount,
    rd.ts_start,
    rd.duration
FROM
    rewards_distributed rd
    join {{ ref(target.name ~ "_reward_distributors")}} dist on rd.distributor = dist.distributor_address
ORDER BY
    ts
