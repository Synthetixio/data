with events as (
    select
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        market_id,
        net_issuance,
        deposited_collateral_value,
        target as sender,
        'USD' as collateral_type,
        credit_capacity,
        amount as token_amount
    from
        (
            {{ get_event_data(
                'base',
                'sepolia',
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
        market_id,
        net_issuance,
        deposited_collateral_value,
        target as sender,
        'USD' as collateral_type,
        credit_capacity,
        amount as token_amount
    from
        (
            {{ get_event_data(
                'base',
                'sepolia',
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
        market_id,
        net_issuance,
        deposited_collateral_value,
        sender,
        collateral_type,
        credit_capacity,
        token_amount
    from
        (
            {{ get_event_data(
                'base',
                'sepolia',
                'core_proxy',
                'market_collateral_deposited'
            ) }}
        ) collateral_deposited -- noqa: AL05
    union all
    select
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        market_id,
        net_issuance,
        deposited_collateral_value,
        sender,
        collateral_type,
        credit_capacity,
        token_amount
    from
        (
            {{ get_event_data(
                'base',
                'sepolia',
                'core_proxy',
                'market_collateral_withdrawn'
            ) }}
        ) as collateral_withdrawn -- noqa: AL05
    union all
    select
        id,
        block_timestamp,
        block_number,
        transaction_hash,
        contract,
        event_name,
        market_id,
        net_issuance,
        deposited_collateral_value,
        target as sender,
        'USD' as collateral_type,
        credit_capacity,
        amount as token_amount
    from
        (
            {{ get_event_data(
                'base',
                'sepolia',
                'core_proxy',
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
        market_id,
        net_issuance,
        deposited_collateral_value,
        target as sender,
        'USD' as collateral_type,
        credit_capacity,
        amount as token_amount
    from
        (
            {{ get_event_data(
                'base',
                'sepolia',
                'core_proxy',
                'market_usd_withdrawn'
            ) }}
        ) as usd_withdrawn -- noqa: AL05
)

select *
from
    events
order by
    block_timestamp
