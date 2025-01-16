with trades as (

    select
        a.id,
        a.block_number,
        a.ts,
        a.transaction_hash,
        a.contract,
        a.event_name,
        a.account,
        a.token,
        a.leverage,
        upper(substring(a.token from '([^_]+)')) as market,
        a.leveraged_token_amount,
        a.base_asset_amount,
        abs(a.leveraged_token_amount) as nominal_volume,
        abs(a.leveraged_token_amount) * a.leverage as notional_volume
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
            cast(
                regexp_replace(token, '.*_(long|short)', '') as int
            ) as leverage,
            {{ convert_wei('leveraged_token_amount') }}
            as leveraged_token_amount,
            {{ convert_wei('base_asset_amount') }} as base_asset_amount
        from {{ ref('lt_minted_base_mainnet') }}
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
            cast(
                regexp_replace(token, '.*_(long|short)', '') as int
            ) as leverage,
            {{ convert_wei('leveraged_token_amount') }}
            * -1 as leveraged_token_amount,
            {{ convert_wei('base_asset_amount') }} * -1 as base_asset_amount
        from {{ ref('lt_redeemed_base_mainnet') }}
    ) as a
),

prices as (
    select distinct
        market_symbol as market,
        block_number,
        last(fill_price)
            over (partition by market_symbol, block_number order by id)
        as price
    from {{ ref('fct_perp_trades_base_mainnet') }}
)

select
    trades.*,
    prices.price
from trades
left join prices
    on
        trades.market = prices.market
        and trades.block_number = prices.block_number
