{{ config(
    materialized = 'incremental',
    unique_key = 'block_number',
    post_hook = [ "create index if not exists idx_block_number on {{ this }} (block_number)", "create index if not exists idx_market on {{ this }} (market)"]
) }}

with funding as (
    select
        block_number,
        market,
        {{ convert_wei('funding_rate') }} as funding_rate
    from
        (
            select
                block_number,
                market,
                funding_rate,
                ROW_NUMBER() over (
                    partition by
                        block_number,
                        market
                    order by
                        id desc
                ) as rn
            from
                {{ ref(
                    'v2_perp_funding_recomputed_optimism_mainnet'
                ) }}

            {% if is_incremental() %}
                where
                    block_number > (
                        select COALESCE(MAX(block_number), 0) as b
                        from
                            {{ this }}
                    )
            {% endif %}
        ) as subquery
    where
        rn = 1
)

select *
from
    funding
