with events as (
    select *
    from
        {{ ref('v2_perp_margin_transferred_optimism_mainnet') }}
)

select
    id,
    transaction_hash,
    block_timestamp as ts,
    block_number,
    market,
    account,
    margin_delta,
    -- calculate cumulative net delta
    SUM(margin_delta) over (
        partition by market
        order by
            id
    ) as net_market_transfers,
    SUM(margin_delta) over (
        order by
            id
    ) as net_transfers
from
    events
