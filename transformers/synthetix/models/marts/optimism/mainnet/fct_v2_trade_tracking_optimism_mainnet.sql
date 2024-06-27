{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    post_hook = [ "create index if not exists idx_id on {{ this }} (id)"]
) }}

WITH order_submit AS (

    SELECT
        block_timestamp,
        contract,
        account,
        tracking_code
    FROM
        {{ ref('v2_perp_delayed_order_submitted_optimism_mainnet') }}
),
position_modified AS (
    SELECT
        id,
        block_number,
        contract,
        account,
        block_timestamp
    FROM
        {{ ref('v2_perp_position_modified_optimism_mainnet') }}
    WHERE
        trade_size != 0

{% if is_incremental() %}
AND block_number > (
    SELECT
        COALESCE(MAX(block_number), 0)
    FROM
        {{ this }})
    {% endif %}
),
combined AS (
    SELECT
        position_modified.id,
        position_modified.block_number,
        order_submit.tracking_code,
        ROW_NUMBER() over (
            PARTITION BY position_modified.contract,
            position_modified.account,
            position_modified.id
            ORDER BY
                order_submit.block_timestamp DESC
        ) AS rn
    FROM
        position_modified
        JOIN order_submit
        ON position_modified.contract = order_submit.contract
        AND position_modified.account = order_submit.account
        AND position_modified.block_timestamp BETWEEN order_submit.block_timestamp
        AND order_submit.block_timestamp + INTERVAL '5' MINUTE
)
SELECT
    id,
    block_number,
    tracking_code
FROM
    combined
WHERE
    rn = 1
