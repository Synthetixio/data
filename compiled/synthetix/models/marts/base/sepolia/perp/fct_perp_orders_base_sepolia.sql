with base as (
    select
        oc.id,
        oc.block_timestamp as ts,
        oc.block_number,
        oc.transaction_hash,
        oc.contract,
        oc.market_id,
        markets.market_symbol,
        CAST(
            oc.account_id as text
        ) as account_id,
        oc.order_type,
        
    oc.size_delta / 1e18
 as size,
        
    oc.acceptable_price / 1e18
 as acceptable_price,
        oc.settlement_time,
        oc.expiration_time,
        
    LEFT(
        REGEXP_REPLACE(
            encode(
                DECODE(REPLACE(oc.tracking_code, '0x', ''), 'hex'),
                'escape'
            ) :: text,
            '\\000',
            '',
            'g'
        ),
        20
    )
 as tracking_code,
        oc.sender
    from
        "analytics"."prod_raw_base_sepolia"."perp_order_committed_base_sepolia"
        as oc
    left join "analytics"."prod_base_sepolia"."fct_perp_markets_base_sepolia" as markets
        on oc.market_id = markets.id
)

select *
from
    base