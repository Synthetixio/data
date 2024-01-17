WITH market_updated AS (
    SELECT
        DISTINCT block_number,
        LAST_VALUE((reported_debt + token_amount) / 1e18) over (
            PARTITION BY block_number
            ORDER BY
                id
        ) AS reported_debt
    FROM
        {{ ref('core_market_updated') }}
    WHERE
        market_id = 2
),
net_transfers AS (
    SELECT
        DISTINCT block_timestamp,
        block_number,
        LAST_VALUE(net_transfers) over (
            PARTITION BY block_number
            ORDER BY
                id
        ) AS net_transfers
    FROM
        (
            SELECT
                id,
                block_timestamp,
                block_number,
                SUM(
                    amount_delta / 1e18
                ) over (
                    ORDER BY
                        id
                ) AS net_transfers
            FROM
                {{ ref('perp_collateral_modified') }}
        ) modified
)
SELECT
    nt.block_timestamp AS ts,
    nt.block_number,
    2 AS market_id,
    nt.net_transfers,
    mu.reported_debt,
    mu.reported_debt - nt.net_transfers AS trader_pnl,
    nt.net_transfers - mu.reported_debt AS market_pnl
FROM
    net_transfers nt
    JOIN market_updated mu
    ON nt.block_number = mu.block_number
ORDER BY
    nt.block_number
