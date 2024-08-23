with base as (
    select
        block_timestamp as created_ts,
        "owner",
        CAST(
            account_id as VARCHAR
        ) as id
    from
        {{ ref('perp_account_created_base_mainnet') }}
)

select *
from
    base
