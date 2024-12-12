with spot_order_cancelled as (
    {{ get_event_data( -- noqa
        'base',
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
    async_order_claim,
    market_id,
    async_order_id
from spot_order_cancelled
