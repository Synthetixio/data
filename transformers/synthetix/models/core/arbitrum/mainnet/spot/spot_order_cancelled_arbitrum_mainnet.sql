with spot_order_cancelled as (
    {{ get_event_data(
        'arbitrum',
        'mainnet',
        'synthetix',
        'spot_market_proxy',
        'order_cancelled'
    ) }}
)

select
    id,
    block_timestamp,
    block_number,
    transaction_hash,
    contract,
    event_name,
    sender,
    async_order_claim
from spot_order_cancelled