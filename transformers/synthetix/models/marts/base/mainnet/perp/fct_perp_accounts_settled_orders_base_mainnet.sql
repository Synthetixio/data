{{ config(
    materialized = "view",
    tags = ["perp", "account_activity", "base", "mainnet"]
) }}

select 
    block_timestamp,
    account_id
from {{ ref('perp_order_settled_base_mainnet') }}