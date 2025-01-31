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
        abs(a.leveraged_token_amount) * a.leverage as notional_volume,
        abs(a.base_asset_amount) / abs(a.leveraged_token_amount) as token_price,
        sum(a.leveraged_token_amount)
            over (partition by contract order by ts)
        as total_supply
    from (

        select
            id,
            block_number,
            block_timestamp as ts,
            transaction_hash,
            contract, -- noqa
            event_name,
            recipient as account,
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
            contract, -- noqa
            event_name,
            "caller" as account, -- noqa
            token,
            cast(
                regexp_replace(token, '.*_(long|short)', '') as int
            ) as leverage,
            {{ convert_wei('leveraged_token_amount') }}
            * -1 as leveraged_token_amount,
            {{ convert_wei('base_asset_amount') }} * -1 as base_asset_amount
        from {{ ref('lt_redeemed_base_mainnet') }}
    ) as a
)

select
    *,
    total_supply * token_price as vault_tvl,
    total_supply * token_price * leverage as vault_oi
from trades
