with arbitrum as (
    select
        perps_market_id as id,
        block_timestamp as created_ts,
        block_number,
        market_symbol,
        market_name
    from
        "analytics"."prod_raw_arbitrum_mainnet"."perp_market_created_arbitrum_mainnet"
)

select *
from
    arbitrum