if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

QUERY_DEF = """
INSERT INTO {DEST_DB}.{DEST_TABLE}

WITH 
time_range AS (
    SELECT
        p.pool_id,
        p.collateral_type,
        toStartOfHour(min(t.ts)) AS min_ts,
        toStartOfHour(max(t.ts)) AS max_ts
    FROM
        (
            SELECT ts
            FROM {RAW_DATABASE}.core_vault_debt
        ) AS t
    CROSS JOIN (
        SELECT DISTINCT
            pool_id,
            collateral_type
        FROM
            {RAW_DATABASE}.core_vault_debt
    ) AS p
    GROUP BY
        p.pool_id,
        p.collateral_type
),

-- Then create the time series using arrayJoin
dim AS (
    SELECT
        pool_id,
        collateral_type,
        arrayJoin(
            arrayMap(
                x -> dateAdd(hour, x, min_ts),
                range(0, dateDiff('hour', min_ts, max_ts) + 1)
            )
        ) AS ts
    FROM time_range
),

issuance as (
    select
        ts,
        pool_id,
        collateral_type,
        hourly_issuance
    from
        {ANALYTICS_DATABASE}.pool_issuance_hourly
),

debt as (
    select distinct
        pool_id,
        collateral_type,
        date_trunc(
            'hour',
            ts
        ) as ts,
        last_value(debt) over (
            partition by date_trunc('hour', ts), pool_id, collateral_type
            order by
                ts
            rows between unbounded preceding
            and unbounded following
        ) as debt
    from
        {RAW_DATABASE}.core_vault_debt
),

collateral as (
    select distinct
        pool_id,
        collateral_type,
        date_trunc(
            'hour',
            ts
        ) as ts,
        last_value(collateral_value) over (
            partition by date_trunc('hour', ts), pool_id, collateral_type
            order by
                ts
            rows between unbounded preceding
            and unbounded following
        ) as collateral_value
    from
        {RAW_DATABASE}.core_vault_collateral
    where
        pool_id = 1 
),

ffill as (
    select
        dim.ts as ts,
        dim.pool_id as pool_id,
        dim.collateral_type as collateral_type,
        coalesce(
            last_value(debt) over (
                partition by dim.collateral_type, dim.pool_id
                order by dim.ts
                rows between unbounded preceding and current row
            ),
            0
        ) as debt,
        coalesce(
            last_value(collateral_value) over (
                partition by dim.collateral_type, dim.pool_id
                order by dim.ts
                rows between unbounded preceding and current row
            ),
            0
        ) as collateral_value
    from
        dim
    left join debt
        on
            dim.ts = debt.ts
            and dim.pool_id = debt.pool_id
            and dim.collateral_type = debt.collateral_type
    left join collateral
        on
            dim.ts = collateral.ts
            and dim.pool_id = collateral.pool_id
            and dim.collateral_type = collateral.collateral_type
),

hourly_pnl as (
    select
        ts,
        pool_id,
        collateral_type,
        collateral_value,
        debt,
        coalesce(lagInFrame(debt) over (
            partition by pool_id, collateral_type
            order by
                ts
        ) - debt, 0) as hourly_pnl
    from
        ffill
),

hourly_rewards as (
    select
        ts,
        pool_id,
        collateral_type,
        rewards_usd
    from
        (
            SELECT
                ts,
                pool_id,
                collateral_type,
                SUM(rewards_usd) as rewards_usd
            FROM {ANALYTICS_DATABASE}.token_rewards_hourly
            group by ts, pool_id, collateral_type
        )
),

hourly_returns as (
    select
        pnl.ts as ts,
        pnl.pool_id as pool_id,
        pnl.collateral_type as collateral_type,
        pnl.collateral_value as collateral_value,
        pnl.debt as debt,
        coalesce(
            iss.hourly_issuance,
            0
        ) as hourly_issuance,
        pnl.hourly_pnl + coalesce(
            iss.hourly_issuance,
            0
        ) as hourly_pnl,
        coalesce(
            rewards.rewards_usd,
            0
        ) as rewards_usd,
        case
            when pnl.collateral_value = 0 then 0
            else coalesce(
                rewards.rewards_usd,
                0
            ) / pnl.collateral_value
        end as hourly_rewards_pct,
        case
            when pnl.collateral_value = 0 then 0
            else
                (coalesce(iss.hourly_issuance, 0) + pnl.hourly_pnl)
                / pnl.collateral_value
        end as hourly_pnl_pct,
        case
            when pnl.collateral_value = 0 then 0
            else
                (
                    coalesce(rewards.rewards_usd, 0)
                    + pnl.hourly_pnl
                    + coalesce(iss.hourly_issuance, 0)
                )
                / pnl.collateral_value
        end as hourly_total_pct
    from
        hourly_pnl as pnl
    left join hourly_rewards as rewards
        on
            pnl.ts = rewards.ts
            and pnl.pool_id = rewards.pool_id
            and lower(pnl.collateral_type) = lower(rewards.collateral_type)
    left join issuance as iss
        on
            pnl.ts = iss.ts
            and pnl.pool_id = iss.pool_id
            and lower(
                pnl.collateral_type
            ) = lower(
                iss.collateral_type
            )
)

select
    ts,
    pool_id,
    collateral_type,
    collateral_value,
    debt,
    hourly_issuance,
    hourly_pnl,
    rewards_usd,
    hourly_pnl_pct,
    hourly_rewards_pct,
    hourly_total_pct
from
    hourly_returns

"""

@data_exporter
def export_data(data, *args, **kwargs):

    if kwargs['raw_db'] in ['eth_mainnet']:
        return {}
    
    TABLE_NAME = 'pnl_hourly'
    DATABASE = kwargs['analytics_db']
    
    client = get_client()
    result = client.query(QUERY_DEF.format(
        DEST_TABLE=TABLE_NAME,
        DEST_DB=kwargs['analytics_db'],
        RAW_DATABASE=kwargs['raw_db'],
        ANALYTICS_DATABASE=kwargs['analytics_db'],
        MAX_TS=data['max_ts'][0]
        ))
    
    print(result.result_rows)