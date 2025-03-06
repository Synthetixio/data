with deposited as (
    select
        block_timestamp,
        block_number,
        transaction_hash,
        account_id,
        sender,
        collateral_type,
        token_amount / POWER(10,18) as token_amount,
        NULL::numeric as pool_id,  -- Cast NULL to numeric
        NULL::numeric as leverage,
        NULL::numeric as reward_start,
        NULL::numeric as reward_duration,
        NULL::numeric as market_id,
        NULL::numeric as credit_capacity,
        NULL::numeric as net_issuance,
        NULL as distributor,
        contract,
        'Deposited' as event_name,
        id
    from core_proxy_event_deposited
),

-- Withdrawn events
withdrawn as (
    select
        block_timestamp,
        block_number,
        transaction_hash,
        account_id,
        sender,
        collateral_type,
        token_amount/POWER(10,18) as token_amount,
        NULL::numeric as pool_id,
        NULL::numeric as leverage,
        NULL::numeric as reward_start,
        NULL::numeric as reward_duration,
        NULL::numeric as market_id,
        NULL::numeric as credit_capacity,
        NULL::numeric as net_issuance,
        NULL as distributor,
        contract,
        'Withdrawn' as event_name,
        id
    from core_proxy_event_withdrawn
),

-- Delegation events
delegation as (
    select
        block_timestamp,
        block_number,
        transaction_hash,
        account_id,
        sender,
        collateral_type,
        amount / POWER(10,18) as token_amount,
        CAST(pool_id AS numeric),
        leverage / POWER(10,18) as leverage,
        NULL::numeric as reward_start,
        NULL::numeric as reward_duration,
        NULL::numeric as market_id,
        NULL::numeric as credit_capacity,
        NULL::numeric as net_issuance,
        NULL as distributor,
        contract,
        'DelegationUpdated' as event_name,
        id
    from core_proxy_event_delegation_updated
),

-- USD Minted events
usd_minted as (
    select
        block_timestamp,
        block_number,
        transaction_hash,
        account_id,
        sender,
        collateral_type,
        amount / POWER(10, 18) as token_amount,
        CAST(pool_id AS numeric),
        NULL::numeric as leverage,
        NULL::numeric as reward_start,
        NULL::numeric as reward_duration,
        NULL::numeric as market_id,
        NULL::numeric as credit_capacity,
        NULL::numeric as net_issuance,
        NULL as distributor,
        contract,
        'UsdMinted' as event_name,
        id
    from core_proxy_event_usd_minted
),

-- USD Burned events
usd_burned as (
    select
        block_timestamp,
        block_number,
        transaction_hash,
        account_id,
        sender,
        collateral_type,
        -amount/ POWER(10, 18) as token_amount,
        CAST(pool_id AS numeric),
        NULL::numeric as leverage,
        NULL::numeric as reward_start,
        NULL::numeric as reward_duration,
        NULL::numeric as market_id,
        NULL::numeric as credit_capacity,
        NULL::numeric as net_issuance,
        NULL as distributor,
        contract,
        'UsdBurned' as event_name,
        id
    from core_proxy_event_usd_burned
),

-- Rewards Claimed events
rewards_claimed as (
    select
        block_timestamp,
        block_number,
        transaction_hash,
        account_id,
        NULL as sender,
        collateral_type,
        amount / POWER(10, 18) as token_amount,
        CAST(pool_id AS numeric),
        NULL::numeric as leverage,
        NULL::numeric as reward_start,
        NULL::numeric as reward_duration,
        NULL::numeric as market_id,
        NULL::numeric as credit_capacity,
        NULL::numeric as net_issuance,
        distributor,
        contract,
        'RewardsClaimed' as event_name,
        id
    from core_proxy_event_rewards_claimed
),

-- Rewards Distributed events
rewards_distributed as (
    select
        block_timestamp,
        block_number,
        transaction_hash,
        NULL::numeric as account_id,
        NULL as sender,
        collateral_type,
        amount / POWER(10, 18) as token_amount,
        CAST(pool_id AS numeric),
        NULL::numeric as leverage,
        CAST("start" AS numeric) as reward_start,
        CAST("duration" AS numeric) as reward_duration,
        NULL::numeric as market_id,
        NULL::numeric as credit_capacity,
        NULL::numeric as net_issuance,
        distributor,
        contract,
        'RewardsDistributed' as event_name,
        id
    from core_proxy_event_rewards_distributed
),

-- Market events
market_events as (
    with core_proxy_event_market_updated as  (
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
            select * from core_proxy_event_market_collateral_deposited
        ) as collateral_deposited -- noqa: AL05
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
            select * from core_proxy_event_market_collateral_withdrawn
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
            select * from core_proxy_event_market_usd_deposited
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
            select * from core_proxy_event_market_usd_withdrawn
        ) as usd_withdrawn
    )
    select
        block_timestamp,
        block_number,
        transaction_hash,
        NULL::numeric as account_id,
        sender,
        collateral_type,
        token_amount / POWER(10, 18) as token_amount,
        NULL::numeric as pool_id,
        NULL::numeric as leverage,
        NULL::numeric as reward_start,
        NULL::numeric as reward_duration,
        CAST(market_id AS numeric),
        credit_capacity / POWER(10, 18) as credit_capacity,
        net_issuance / POWER(10, 18) as net_issuance,
        NULL as distributor,
        contract,
        event_name,
        id
    from core_proxy_event_market_updated
)

-- Combine all events
select 
    block_timestamp,
    block_number,
    transaction_hash,
    account_id,
    sender,
    collateral_type,
    token_amount,
    pool_id,
    leverage,
    reward_start,
    reward_duration,
    market_id,
    credit_capacity,
    net_issuance,
    distributor,
    contract,
    event_name,
    id
from deposited
union all
select 
    block_timestamp,
    block_number,
    transaction_hash,
    account_id,
    sender,
    collateral_type,
    token_amount,
    pool_id,
    leverage,
    reward_start,
    reward_duration,
    market_id,
    credit_capacity,
    net_issuance,
    distributor,
    contract,
    event_name,
    id
from withdrawn
union all
select 
    block_timestamp,
    block_number,
    transaction_hash,
    account_id,
    sender,
    collateral_type,
    token_amount,
    pool_id,
    leverage,
    reward_start,
    reward_duration,
    market_id,
    credit_capacity,
    net_issuance,
    distributor,
    contract,
    event_name,
    id
from delegation
union all
select 
    block_timestamp,
    block_number,
    transaction_hash,
    account_id,
    sender,
    collateral_type,
    token_amount,
    pool_id,
    leverage,
    reward_start,
    reward_duration,
    market_id,
    credit_capacity,
    net_issuance,
    distributor,
    contract,
    event_name,
    id
from usd_minted
union all
select 
    block_timestamp,
    block_number,
    transaction_hash,
    account_id,
    sender,
    collateral_type,
    token_amount,
    pool_id,
    leverage,
    reward_start,
    reward_duration,
    market_id,
    credit_capacity,
    net_issuance,
    distributor,
    contract,
    event_name,
    id
from usd_burned
union all
select 
    block_timestamp,
    block_number,
    transaction_hash,
    account_id,
    sender,
    collateral_type,
    token_amount,
    pool_id,
    leverage,
    reward_start,
    reward_duration,
    market_id,
    credit_capacity,
    net_issuance,
    distributor,
    contract,
    event_name,
    id
from rewards_claimed
union all
select 
    block_timestamp,
    block_number,
    transaction_hash,
    account_id,
    sender,
    collateral_type,
    token_amount,
    pool_id,
    leverage,
    reward_start,
    reward_duration,
    market_id,
    credit_capacity,
    net_issuance,
    distributor,
    contract,
    event_name,
    id
from rewards_distributed
union all
select 
    block_timestamp,
    block_number,
    transaction_hash,
    account_id,
    sender,
    collateral_type,
    token_amount,
    pool_id,
    leverage,
    reward_start,
    reward_duration,
    market_id,
    credit_capacity,
    net_issuance,
    distributor,
    contract,
    event_name,
    id
from market_events