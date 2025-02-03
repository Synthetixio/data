with
zap_accounts as (
    select distinct
        transaction_hash,
        account
    from
        {{ ref('tlx_lt_zap_swaps_optimism_mainnet') }}
),

trades as (
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
        abs(a.base_asset_amount) as nominal_volume,
        abs(a.base_asset_amount) * a.leverage as notional_volume,
        abs(a.base_asset_amount) / abs(a.leveraged_token_amount) as token_price,
        sum(a.leveraged_token_amount)
            over (partition by contract order by ts)
        as total_supply
    from (
        select
            m.id,
            m.block_number,
            m.block_timestamp as ts,
            m.transaction_hash,
            m.contract,
            m.event_name,
            COALESCE(z.account, m.account) as account,
            m.token,
            cast(
                regexp_replace(m.token, '.*_(long|short)', '') as int
            ) as leverage,
            -- Swapped columns for contract bug
            {{ convert_wei('m.base_asset_amount') }}
            as leveraged_token_amount,
            {{ convert_wei('m.leveraged_token_amount') }} as base_asset_amount
        from {{ ref('tlx_lt_minted_optimism_mainnet') }} as m
        left join zap_accounts as z
            on m.transaction_hash = z.transaction_hash
        
        union all
        
        select
            r.id,
            r.block_number,
            r.block_timestamp as ts,
            r.transaction_hash,
            r.contract,
            r.event_name,
            COALESCE(z.account, r.account) as account,
            r.token,
            cast(
                regexp_replace(r.token, '.*_(long|short)', '') as int
            ) as leverage,
            -- Swapped columns for contract bug
            {{ convert_wei('r.base_asset_amount') }}
            * -1 as leveraged_token_amount,
            {{ convert_wei('r.leveraged_token_amount') }} * -1 as base_asset_amount
        from {{ ref('tlx_lt_redeemed_optimism_mainnet') }} as r
        left join zap_accounts as z
            on r.transaction_hash = z.transaction_hash
    ) as a
)

select
    *,
    total_supply * token_price as vault_tvl,
    total_supply * token_price * leverage as vault_oi
from trades