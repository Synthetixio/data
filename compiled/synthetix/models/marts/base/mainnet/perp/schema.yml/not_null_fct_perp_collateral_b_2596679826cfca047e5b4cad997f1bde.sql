
    
    



select transaction_hash
from "analytics"."prod_base_mainnet"."fct_perp_collateral_balances_base_mainnet"
where transaction_hash is null

