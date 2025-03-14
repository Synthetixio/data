
select 
    * 
from perps_market_proxy_event_market_created
where block_timestamp >= '{{ block_output("perp_market_created_arbitrum_mainnet_check", parse=lambda data, _vars: data["max_ts"][0] if data["max_ts"][0] is not None else "1970-01-01 00:00:00") }}'