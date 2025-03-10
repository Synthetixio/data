select 
    * 
from core_proxy_event_rewards_distributed
where block_timestamp >= '{{ block_output("core_rewards_distributed_arbitrum_mainnet_check", parse=lambda data, _vars: data["max_ts"][0] if data["max_ts"][0] is not None else "1970-01-01 00:00:00") }}'