{{ config(
    materialized = "view",
    tags = ["perp", "collateral_balances", "base", "mainnet"]
) }}

with synths as (
    select
        synth_market_id as collateral_id,
        synth_token_address
    from
        {{ ref('spot_synth_registered_base_mainnet') }}
),

transfers as (
    select
        cm.block_number as block_number,
        cm.block_timestamp as ts,
        cm.transaction_hash as transaction_hash,
        cm.collateral_id as collateral_id,
        synths.synth_token_address as synth_token_address,
        CAST(
            cm.account_id as text
        ) as account_id,
        {{ convert_wei('cm.amount_delta') }} as amount_delta
    from
        {{ ref('perp_collateral_modified_base_mainnet') }} as cm
    inner join synths
        on cm.collateral_id = synths.collateral_id
),

liq_tx as (
    select distinct
        transaction_hash,
        CAST(
            account_id as text
        ) as account_id
    from
        {{ ref('perp_account_liquidation_attempt_base_mainnet') }}
),

distributors as (
    select
        CAST(
            rd.distributor_address as text
        ) as distributor_address,
        CAST(
            rd.token_symbol as text
        ) as token_symbol,
        rd.synth_token_address as synth_token_address,
        synths.collateral_id as collateral_id
    from
        {{ ref('base_mainnet_reward_distributors') }} as rd
    inner join synths
        on rd.synth_token_address = synths.synth_token_address
),

liquidations as (
    select
        rd.block_number as block_number,
        rd.block_timestamp as ts,
        -rd.amount / 1e18 as amount_delta,
        liq_tx.transaction_hash as transaction_hash,
        rd.collateral_type as collateral_type,
        distributors.token_symbol as token_symbol,
        distributors.synth_token_address as synth_token_address,
        CAST(
            liq_tx.account_id as text
        ) as account_id,
        distributors.collateral_id
    from
        {{ ref('core_rewards_distributed_base_mainnet') }} as rd
    inner join liq_tx
        on rd.transaction_hash = liq_tx.transaction_hash
    inner join distributors
        on rd.distributor = distributors.distributor_address
),

net_transfers as (
    select
        events.ts as ts,
        events.transaction_hash as transaction_hash,
        events.event_type as event_type,
        events.collateral_id as collateral_id,
        events.synth_token_address as synth_token_address,
        synths.synth_symbol as synth_symbol,
        events.account_id as account_id,
        prices.price as price,
        events.amount_delta as amount_delta,
        SUM(
            events.amount_delta
        ) over (
            partition by
                events.account_id,
                events.collateral_id
            order by
                events.ts
        ) as account_balance,
        SUM(
            events.amount_delta
        ) over (
            partition by events.collateral_id
            order by
                events.ts
        ) as total_balance
    from
        (
            select
                transfers.ts as ts,
                transfers.transaction_hash as transaction_hash,
                transfers.collateral_id as collateral_id,
                transfers.synth_token_address as synth_token_address,
                transfers.account_id as account_id,
                transfers.amount_delta as amount_delta,
                'transfer' as event_type
            from
                transfers
            union all
            select
                liquidations.ts as ts,
                liquidations.transaction_hash as transaction_hash,
                liquidations.collateral_id as collateral_id,
                liquidations.synth_token_address as synth_token_address,
                liquidations.account_id as account_id,
                liquidations.amount_delta as amount_delta,
                'liquidation' as event_type
            from
                liquidations
        ) as events
    inner join {{ ref('base_mainnet_synths') }} as synths
        on events.collateral_id = synths.synth_market_id
    left join {{ ref('fct_prices_hourly_base_mainnet') }} as prices
        on
            synths.token_symbol = prices.market_symbol
            and DATE_TRUNC(
                'hour',
                events.ts
            ) = prices.ts
)

select
    ts,
    transaction_hash,
    event_type,
    collateral_id,
    synth_token_address,
    synth_symbol,
    account_id,
    price,
    amount_delta,
    amount_delta * price as amount_delta_usd,
    account_balance,
    account_balance * price as account_balance_usd,
    total_balance,
    total_balance * price as total_balance_usd
from
    net_transfers
