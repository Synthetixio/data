with synths as (
    select
        synth_market_id as collateral_id,
        synth_token_address
    from
        {{ ref('spot_synth_registered_arbitrum_mainnet') }}
),

transfers as (
    select
        cm.block_number,
        cm.block_timestamp as ts,
        cm.transaction_hash,
        cm.collateral_id,
        synths.synth_token_address,
        account_id,
        {{ convert_wei(
            'cm.amount_delta'
        ) }} as amount_delta
    from
        {{ ref('perp_collateral_modified_arbitrum_mainnet') }}
        as cm
    inner join synths
        on cm.collateral_id = synths.collateral_id
),

liq_tx as (
    select distinct
        transaction_hash,
        account_id
    from
        {{ ref('perp_account_liquidation_attempt_arbitrum_mainnet') }}
),

distributors as (
    select
        CAST(
            rd.distributor_address as text
        ) as distributor_address,
        CAST(
            rd.token_symbol as text
        ) as token_symbol,
        rd.synth_token_address,
        synths.collateral_id
    from
        {{ ref('arbitrum_mainnet_reward_distributors') }}
        as rd
    inner join synths
        on rd.synth_token_address = synths.synth_token_address
),

liquidations as (
    select
        block_number,
        block_timestamp as ts,
        -amount / 1e18 as amount_delta,
        liq_tx.transaction_hash,
        collateral_type,
        token_symbol,
        synth_token_address,
        account_id,
        distributors.collateral_id
    from
        prod_raw_arbitrum_mainnet.core_rewards_distributed_arbitrum_mainnet as rd
    inner join liq_tx
        on rd.transaction_hash = liq_tx.transaction_hash
    inner join distributors
        on rd.distributor = distributors.distributor_address
),

net_transfers as (
    select
        events.ts,
        events.transaction_hash,
        events.event_type,
        events.collateral_id,
        events.synth_token_address,
        synths.synth_symbol,
        events.account_id,
        events.amount_delta,
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
                ts,
                transaction_hash,
                collateral_id,
                synth_token_address,
                account_id,
                amount_delta,
                'transfer' as event_type
            from
                transfers
            union all
            select
                ts,
                transaction_hash,
                collateral_id,
                synth_token_address,
                account_id,
                amount_delta,
                'liquidation' as event_type
            from
                liquidations
        ) as events
    inner join
        {{ ref('arbitrum_mainnet_synths') }}
        as synths
        on events.collateral_id = synths.synth_market_id
)

select
    ts,
    transaction_hash,
    event_type,
    collateral_id,
    synth_token_address,
    synth_symbol,
    account_id,
    amount_delta,
    account_balance,
    total_balance
from
    net_transfers
