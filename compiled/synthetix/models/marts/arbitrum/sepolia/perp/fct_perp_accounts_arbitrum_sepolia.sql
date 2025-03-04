with arbitrum as (
    select
        block_timestamp as created_ts,
        "owner",
        CAST(
            account_id as VARCHAR
        ) as id
    from
        "analytics"."prod_raw_arbitrum_sepolia"."perp_account_created_arbitrum_sepolia"
)

select *
from
    arbitrum