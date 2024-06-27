WITH wrapper AS (
    SELECT
        ts,
        block_number,
        synth_market_id,
        amount_wrapped AS change_amount
    FROM
        {{ ref('fct_spot_wrapper_base_sepolia') }}
),
atomics AS (
    SELECT
        ts,
        block_number,
        synth_market_id,
        amount AS change_amount
    FROM
        {{ ref('fct_spot_atomics_base_sepolia') }}
    UNION ALL
    SELECT
        ts,
        block_number,
        0 AS synth_market_id,
        amount * price * -1 AS change_amount
    FROM
        {{ ref('fct_spot_atomics_base_sepolia') }}
),
usd_changes AS (
    SELECT
        block_timestamp AS ts,
        block_number,
        0 AS synth_market_id,
        {{ convert_wei("amount") }} AS change_amount
    FROM
        {{ ref('core_usd_minted_base_sepolia') }}
    UNION ALL
    SELECT
        block_timestamp AS ts,
        block_number,
        0 AS synth_market_id,
        -1 * {{ convert_wei("amount") }} AS change_amount
    FROM
        {{ ref('core_usd_burned_base_sepolia') }}
),
all_changes AS (
    SELECT
        *
    FROM
        wrapper
    UNION ALL
    SELECT
        *
    FROM
        atomics
    UNION ALL
    SELECT
        *
    FROM
        usd_changes
)
SELECT
    ts,
    block_number,
    synth_market_id,
    SUM(change_amount) over (
        PARTITION BY synth_market_id
        ORDER BY
            ts,
            block_number
    ) AS supply
FROM
    all_changes
