
    
    



select block_timestamp
from "analytics"."prod_base_mainnet"."fct_perp_previous_order_expired_base_mainnet"
where block_timestamp is null


