{{ config(
    materialized = "view",
    tags = ["perp", "account_activity", "arbitrum", "mainnet"]
) }}

select
    block_timestamp,
    account_id
from {{ ref('perp_order_settled_arbitrum_mainnet') }}
