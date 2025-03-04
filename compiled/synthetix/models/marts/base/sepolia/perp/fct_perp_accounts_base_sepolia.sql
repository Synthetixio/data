with base as (
    select
        block_timestamp as created_ts,
        "owner",
        CAST(
            account_id as VARCHAR
        ) as id
    from
        "analytics"."prod_raw_base_sepolia"."perp_account_created_base_sepolia"
)

select *
from
    base