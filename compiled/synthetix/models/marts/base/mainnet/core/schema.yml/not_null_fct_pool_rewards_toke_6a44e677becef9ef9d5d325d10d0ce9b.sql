
    
    



select liquidation_rewards_usd
from "analytics"."prod_base_mainnet"."fct_pool_rewards_token_hourly_base_mainnet"
where liquidation_rewards_usd is null


