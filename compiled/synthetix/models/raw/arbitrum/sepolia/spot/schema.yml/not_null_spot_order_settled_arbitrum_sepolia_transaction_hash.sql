
    
    



select transaction_hash
from "analytics"."prod_raw_arbitrum_sepolia"."spot_order_settled_arbitrum_sepolia"
where transaction_hash is null

