with base as (
    select
        perps_market_id as id,
        block_timestamp as created_ts,
        block_number,
        market_symbol,
        market_name
    from
        "analytics"."prod_raw_base_mainnet"."perp_market_created_base_mainnet"
)

select *
from
    base