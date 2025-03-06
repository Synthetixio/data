with debt as (
    select
        ts,
        block_number,
        pool_id,
        collateral_type,
        debt
    from (
            with base as (
        select
            block_number,
            contract_address,
            chain_id,
            pool_id,
            collateral_type,
            cast(
                value_1 as numeric
            ) as debt
        from
            core_get_vault_debt
        where
            value_1 is not null
    )

    select
        to_timestamp(blocks.timestamp) as ts,
        cast(
            blocks.block_number as integer
        ) as block_number,
        base.contract_address,
        cast(
            base.pool_id as integer
        ) as pool_id,
        cast(
            base.collateral_type as varchar
        ) as collateral_type,
        base.debt / POWER(10, 18) as debt
    from
        base
    inner join blocks_parquet as blocks
        on base.block_number = blocks.block_number
    ) as core_vault_debt_arbitrum_mainnet
),

-- Get vault collateral values
collateral as (
    select
        ts,
        block_number,
        pool_id,
        collateral_type,
        amount,
        collateral_value
    from (
            with base as (
        select
            block_number,
            contract_address,
            chain_id,
            pool_id,
            collateral_type,
            cast(
                amount as numeric
            ) as amount,
            cast(
                value as numeric
            ) as collateral_value
        from
            core_get_vault_collateral
        where
            amount is not null
    )

    select
        to_timestamp(blocks.timestamp) as ts,
        cast(
            blocks.block_number as integer
        ) as block_number,
        base.contract_address,
        cast(
            base.pool_id as integer
        ) as pool_id,
        cast(
            base.collateral_type as varchar
        ) as collateral_type,
        base.amount/ POWER(10, 18) as amount,
        base.collateral_value / POWER(10, 18) as collateral_value
    from
        base
    inner join blocks_parquet as blocks
        on base.block_number = blocks.block_number

    ) as core_vault_collateral_arbitrum_mainnet
),

-- Get issuance data (minted/burned USD)
issuance_base as (
    select
        block_timestamp as ts,
        block_number,
        transaction_hash,
        pool_id,
        collateral_type,
        account_id,
        token_amount as amount
    from core_events_base
    where event_name in ('UsdMinted', 'UsdBurned')
),

-- Calculate issuance by hour
issuance_hourly as (
    select
        date_trunc('hour', ts) as ts,
        pool_id,
        collateral_type,
        sum(amount) as hourly_issuance
    from issuance_base
    group by 1, 2, 3
),

-- Get delegation data
delegation as (
    select
        block_timestamp as ts,
        CAST(account_id AS numeric) as account_id,
        CAST(pool_id AS numeric) as pool_id,
        collateral_type,
        token_amount - LAG(token_amount, 1, 0) over (
            partition by account_id, pool_id, collateral_type
            order by block_timestamp
        ) as change_in_amount
    from arbitrum_mainnet.core_events_base
    where event_name = 'DelegationUpdated'
),

-- Calculate cumulative delegation by pool and collateral type
pool_delegation as (
    select
        ts,
        pool_id,
        collateral_type,
        sum(change_in_amount) over (
            partition by pool_id, collateral_type
            order by ts
        ) as cumulative_delegation
    from delegation
),

-- Define the dimensions (all hours, pools, collateral types)
dim as (
    select
        d.ts,
        p.pool_id,
        p.collateral_type
    from (
        select
            generate_series(
                date_trunc('hour', (select min(ts) from debt)),
                date_trunc('hour', (select max(ts) from debt)),
                '1 hour'::interval
            ) as ts
    ) as d
    cross join (
        select distinct
            pool_id,
            collateral_type
        from debt
    ) as p
),

-- Join all metrics and fill forward missing values
combined as (
    select
        dim.ts,
        dim.pool_id,
        dim.collateral_type,
        -- Fill forward debt values
        coalesce(
            last(d.debt) over (
                partition by dim.pool_id, dim.collateral_type
                order by dim.ts
                rows between unbounded preceding and current row
            ),
            0
        ) as debt,
        -- Fill forward collateral values
        coalesce(
            last(c.collateral_value) over (
                partition by dim.pool_id, dim.collateral_type
                order by dim.ts
                rows between unbounded preceding and current row
            ),
            0
        ) as collateral_value,
        -- Fill forward amount values
        coalesce(
            last(c.amount) over (
                partition by dim.pool_id, dim.collateral_type
                order by dim.ts
                rows between unbounded preceding and current row
            ),
            0
        ) as amount,
        -- Get hourly issuance or default to 0
        coalesce(i.hourly_issuance, 0) as hourly_issuance,
        -- Fill forward delegation values
        coalesce(
            last(pd.cumulative_delegation) over (
                partition by dim.pool_id, dim.collateral_type
                order by dim.ts
                rows between unbounded preceding and current row
            ),
            0
        ) as amount_delegated
    from dim
    left join debt d on
        date_trunc('hour', d.ts) = dim.ts and
        d.pool_id = dim.pool_id and
        d.collateral_type = dim.collateral_type
    left join collateral c on
        date_trunc('hour', c.ts) = dim.ts and
        c.pool_id = dim.pool_id and
        c.collateral_type = dim.collateral_type
    left join issuance_hourly i on
        i.ts = dim.ts and
        i.pool_id = dim.pool_id and
        i.collateral_type = dim.collateral_type
    left join pool_delegation pd on
        date_trunc('hour', pd.ts) = dim.ts and
        pd.pool_id = dim.pool_id and
        pd.collateral_type = dim.collateral_type
)

select
    ts,
    pool_id,
    collateral_type,
    debt,
    collateral_value,
    amount,
    hourly_issuance,
    amount_delegated,
    -- Calculate cumulative issuance
    sum(hourly_issuance) over (
        partition by pool_id, collateral_type
        order by ts
    ) as cumulative_issuance,
    -- Add unique ID for ClickHouse
    ts::text || '_' || pool_id::text || '_' || collateral_type as unique_id
from combined
order by ts, pool_id, collateral_type