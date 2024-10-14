{{ config(
    materialized = "view",
    tags = ["perp", "account_activity", "arbitrum", "sepolia"]
) }}

select
    block_timestamp,
    account_id
from {{ ref('perp_order_settled_arbitrum_sepolia') }}
