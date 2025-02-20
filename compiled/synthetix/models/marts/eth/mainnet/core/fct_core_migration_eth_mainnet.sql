select
    block_timestamp as ts,
    block_number,
    transaction_hash,
    1 as pool_id, -- Spartan Council pool
    -- SNX collateral
    '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F' as collateral_type,
    staker,
    account_id,
    
    collateral_amount / 1e18
 as collateral_amount,
    
    debt_amount / 1e18
 as debt_amount
from
    "analytics"."prod_raw_eth_mainnet"."core_account_migrated_eth_mainnet"
order by block_timestamp