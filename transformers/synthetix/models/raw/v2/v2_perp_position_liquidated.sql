{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)", "create index if not exists idx_block_timestamp on {{ this }} (block_timestamp)", "create index if not exists idx_block_number on {{ this }} (block_number)", "create index if not exists idx_market on {{ this }} (market)" ]
) }}

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
WHERE

{% if is_incremental() %}
block_number > (
    SELECT
        COALESCE(MAX(block_number), 0)
    FROM
        {{ this }})
    {% else %}
        TRUE
    {% endif %}
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
    WHERE

{% if is_incremental() %}
block_number > (
    SELECT
        COALESCE(MAX(block_number), 0)
    FROM
        {{ this }})
    {% else %}
        TRUE
    {% endif %}
