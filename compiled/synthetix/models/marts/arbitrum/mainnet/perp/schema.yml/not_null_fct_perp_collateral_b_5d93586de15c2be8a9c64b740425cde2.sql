
    
    



select account_balance_usd
from "analytics"."prod_arbitrum_mainnet"."fct_perp_collateral_balances_arbitrum_mainnet"
where account_balance_usd is null

