{{
    config(
        materialized = "view",
        tags = ["analytics", "core", "eth", "mainnet"],
    )
}}

select
    block_timestamp as ts,
    block_number,
    transaction_hash,
    1 as pool_id, -- Spartan Council pool
    -- SNX collateral
    '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F' as collateral_type,
    staker,
    account_id,
    {{ convert_wei('collateral_amount') }} as collateral_amount,
    {{ convert_wei('debt_amount') }} as debt_amount
from
    {{ ref('core_account_migrated_eth_mainnet') }}
order by block_timestamp