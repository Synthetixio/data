{{ config(
    materialized = 'incremental',
    unique_key = 'block_number',
    post_hook = [ "create index if not exists idx_block_number on {{ this }} (block_number)", "create index if not exists idx_market on {{ this }} (market)"]
) }}

WITH funding AS (

    SELECT
        block_number,
        market,
        {{ convert_wei('funding_rate') }} AS funding_rate
    FROM
        (
            SELECT
                block_number,
                market,
                funding_rate,
                ROW_NUMBER() over (
                    PARTITION BY block_number,
                    market
                    ORDER BY
                        id DESC
                ) AS rn
            FROM
                {{ ref(
                    'v2_perp_funding_recomputed_optimism_mainnet'
                ) }}

{% if is_incremental() %}
WHERE
    block_number > (
        SELECT
            COALESCE(MAX(block_number), 0)
        FROM
            {{ this }})
        {% endif %}
    ) AS subquery
WHERE
    rn = 1
)
SELECT
    *
FROM
    funding
