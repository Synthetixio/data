WITH legacy_events AS ({{ get_v2_event_data('position_liquidated1') }}),
current_events AS ({{ get_v2_event_data('position_liquidated0') }})
SELECT
    id,
    transaction_hash,
    block_number,
    block_timestamp,
    contract,
    UPPER(market) AS market,
    event_name,
    account,
    liquidator,
    stakers_fee,
    liquidator_fee,
    flagger_fee,
    stakers_fee + liquidator_fee + flagger_fee AS total_fee,
    price
FROM
    current_events
UNION ALL
SELECT
    id,
    transaction_hash,
    block_number,
    block_timestamp,
    contract,
    UPPER(market) AS market,
    event_name,
    account,
    liquidator,
    fee AS stakers_fee,
    0 AS liquidator_fee,
    0 AS flagger_fee,
    fee AS total_fee,
    price
FROM
    legacy_events
