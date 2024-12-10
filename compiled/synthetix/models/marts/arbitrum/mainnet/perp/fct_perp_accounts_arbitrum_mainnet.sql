with arbitrum as (
    select
        block_timestamp as created_ts,
        "owner",
        CAST(
            account_id as VARCHAR
        ) as id
    from
        "analytics"."prod_raw_arbitrum_mainnet"."perp_account_created_arbitrum_mainnet"
)

select *
from
    arbitrum