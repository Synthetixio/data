WITH legacy_events AS ({{ get_v2_event_data('position_liquidated1') }}),
current_events AS ({{ get_v2_event_data('position_liquidated0') }})
SELECT
    id,
    transaction_hash,
    contract,
    event_name,
    account,
    liquidator,
    stakers_fee,
    liquidator_fee,
    flagger_fee,
    price,
    block_timestamp,
    block_number,
    market
FROM
    current_events
UNION ALL
SELECT
    id,
    transaction_hash,
    contract,
    event_name,
    account,
    liquidator,
    fee AS stakers_fee,
    0 AS liquidator_fee,
    0 AS flagger_fee,
    price,
    block_timestamp,
    block_number,
    market
FROM
    legacy_events
