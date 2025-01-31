{{
    config(
        materialized = "view",
        tags = ["spot", "markets", "base", "mainnet"]
    )
}}

with base as (
    select
        synth_market_id as id,
        block_timestamp as created_ts,
        block_number,
        synth_token_address as token_address
    from
        {{ ref('spot_synth_registered_base_mainnet') }}
)

select
    id,
    created_ts,
    block_number,
    token_address
from
    base
