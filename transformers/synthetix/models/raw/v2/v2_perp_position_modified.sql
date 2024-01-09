WITH legacy_events AS (
    {{ get_v2_event_data(
        'position_modified1'
    ) }}
),
current_events AS (
    {{ get_v2_event_data(
        'position_modified0'
    ) }}
)
SELECT
    *
FROM
    (
        SELECT
            id,
            transaction_hash,
            contract,
            block_timestamp,
            block_number,
            UPPER(market) AS market,
            event_name,
            account,
            funding_index,
            last_price,
            trade_size,
            "size",
            margin,
            fee,
            skew
        FROM
            current_events
        UNION ALL
        SELECT
            id,
            transaction_hash,
            contract,
            block_timestamp,
            block_number,
            UPPER(market) AS market,
            event_name,
            account,
            funding_index,
            last_price,
            trade_size,
            "size",
            margin,
            fee,
            NULL AS skew
        FROM
            legacy_events
    ) AS events
ORDER BY
    id
