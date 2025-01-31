with events as (
    select
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        target as sender,
        'USD' as collateral_type,
        cast(market_id as UInt128) as market_id,
        cast(net_issuance as Int128) as net_issuance,
        cast(
            deposited_collateral_value as UInt256
        ) as deposited_collateral_value,
        cast(credit_capacity as Int128) as credit_capacity,
        cast(amount as UInt256) as token_amount
    from
        (
            {{ get_event_data(
                'base',
                'mainnet',
                'synthetix',
                'core_proxy_legacy',
                'market_usd_deposited'
            ) }}
        ) as usd_deposited -- noqa: AL05
    union all
    select
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        target as sender,
        'USD' as collateral_type,
        cast(market_id as UInt128) as market_id,
        cast(net_issuance as Int128) as net_issuance,
        cast(
            deposited_collateral_value as UInt256
        ) as deposited_collateral_value,
        cast(credit_capacity as Int128) as credit_capacity,
        cast(amount as UInt256) as token_amount
    from
        (
            {{ get_event_data(
                'base',
                'mainnet',
                'synthetix',
                'core_proxy_legacy',
                'market_usd_withdrawn'
            ) }}
        ) as usd_withdrawn -- noqa: AL05
    union all
    select
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        sender,
        collateral_type,
        cast(market_id as UInt128) as market_id,
        cast(net_issuance as Int128) as net_issuance,
        cast(
            deposited_collateral_value as UInt256
        ) as deposited_collateral_value,
        cast(credit_capacity as Int128) as credit_capacity,
        cast(token_amount as UInt256) as token_amount
    from
        (
            {{ get_event_data('base', 'mainnet', 'synthetix', 'core_proxy', 'market_collateral_deposited') }} -- noqa
        ) as collateral_deposited -- noqa: AL05
    union all
    select
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        sender,
        collateral_type,
        cast(market_id as UInt128) as market_id,
        cast(net_issuance as Int128) as net_issuance,
        cast(
            deposited_collateral_value as UInt256
        ) as deposited_collateral_value,
        cast(credit_capacity as Int128) as credit_capacity,
        cast(token_amount as UInt256) as token_amount
    from
        (
            {{ get_event_data('base', 'mainnet', 'synthetix', 'core_proxy', 'market_collateral_withdrawn') }} -- noqa
        ) as collateral_withdrawn -- noqa: AL05
    union all
    select
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        target as sender,
        'USD' as collateral_type,
        cast(market_id as UInt128) as market_id,
        cast(net_issuance as Int128) as net_issuance,
        cast(
            deposited_collateral_value as UInt256
        ) as deposited_collateral_value,
        cast(credit_capacity as Int128) as credit_capacity,
        cast(amount as UInt256) as token_amount
    from
        (
            {{ get_event_data('base', 'mainnet', 'synthetix', 'core_proxy', 'market_usd_deposited') }} -- noqa
        ) as usd_deposited -- noqa: AL05
    union all
    select
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        target as sender,
        'USD' as collateral_type,
        cast(market_id as UInt128) as market_id,
        cast(net_issuance as Int128) as net_issuance,
        cast(
            deposited_collateral_value as UInt256
        ) as deposited_collateral_value,
        cast(credit_capacity as Int128) as credit_capacity,
        cast(amount as UInt256) as token_amount
    from
        (
            {{ get_event_data('base', 'mainnet', 'synthetix', 'core_proxy', 'market_usd_withdrawn') }} -- noqa
        ) as usd_withdrawn -- noqa: AL05
)

select *
from
    events
order by
    block_timestamp
