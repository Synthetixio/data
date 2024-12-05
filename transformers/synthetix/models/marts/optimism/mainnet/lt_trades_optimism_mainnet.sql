with trades as (
    select
        id,
        block_number,
        ts,
        transaction_hash,
        contract,
        event_name,
        account,
        token,
        upper(substring(token from '([^_]+)')) as market,
        leveraged_token_amount,
        base_asset_amount
    from (
        select
            id,
            block_number,
            block_timestamp as ts,
            transaction_hash,
            contract,
            event_name,
            account,
            token,
            {{ convert_wei(leveraged_token_amount) }} as leveraged_token_amount,
            {{ convert_wei(base_asset_amount) }} as base_asset_amount
        from prod_raw_optimism_mainnet.tlx_lt_minted_optimism_mainnet
        union all
        select
            id,
            block_number,
            block_timestamp as ts,
            transaction_hash,
            contract,
            event_name,
            account,
            token,
            {{ convert_wei(leveraged_token_amount) }}
            * -1 as leveraged_token_amount,
            {{ convert_wei(base_asset_amount) }} * -1 as base_asset_amount
        from prod_raw_optimism_mainnet.tlx_lt_redeemed_optimism_mainnet
    ) as a
),

prices as (
    select distinct
        market,
        block_number,
        last(price)
            over (partition by market, block_number order by id)
        as price
    from prod_optimism_mainnet.fct_v2_trades_optimism_mainnet
)

select
    trades.*,
    prices.price,
    abs(trades.leveraged_token_amount) * prices.price as volume
from trades
left join prices
    on
        trades.market = prices.market
        and trades.block_number = prices.block_number
