if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

QUERY_DEF = """
INSERT INTO {DEST_DB}.{DEST_TABLE}
with burns as (
    select
        block_timestamp as ts,
        block_number,
        transaction_hash,
        pool_id,
        collateral_type,
        account_id,
        -1 * amount/1e18 as amount
    from
        {RAW_DATABASE}.core_usd_burned
    order by
        block_timestamp desc
),

mints as (
    select
        block_timestamp as ts,
        block_number,
        transaction_hash,
        pool_id,
        collateral_type,
        account_id,
        amount/1e18 as amount
    from
        {RAW_DATABASE}.core_usd_minted
    order by
        block_timestamp desc
) , pool_issuance as (
    select *
    from
        burns
    union all
    select *
    from
        mints
    order by
        ts desc
), 

dim as (
    WITH 
        min_max AS (
            SELECT
                min(toStartOfHour(ts)) AS min_ts,
                max(toStartOfHour(ts)) AS max_ts
            FROM pool_issuance
        ),
        
        pool_collateral_types AS (
            SELECT DISTINCT
                pool_id,
                collateral_type
            FROM pool_issuance
        ),
        
        hourly_series AS (
            SELECT
                p.pool_id,
                p.collateral_type,
                arrayJoin(
                    arrayMap(
                        x -> dateAdd(hour, x, min_ts),
                        range(0, dateDiff('hour', min_ts, max_ts) + 1)
                    )
                ) AS ts
            FROM pool_collateral_types p
            CROSS JOIN min_max
        )

    SELECT
        pool_id,
        collateral_type,
        ts
    FROM hourly_series
    ORDER BY pool_id, collateral_type, ts
),

max_debt_block as (
    select
        pool_id,
        collateral_type,
        date_trunc(
            'hour',
            ts
        ) as "hour",
        max(block_number) as max_block_number
    from
        {RAW_DATABASE}.core_vault_debt
    group by
        date_trunc(
            'hour',
            ts
        ),
        pool_id,
        collateral_type
),

filt_issuance as (
    select
        i.pool_id as pool_id,
        i.collateral_type as collateral_type,
        i.amount as amount,
        case
            when
                i.block_number <= d.max_block_number
                or d.max_block_number is null then i.ts
            else i.ts + interval '1 hour'
        end as ts
    from
        pool_issuance
        as i
    left join max_debt_block as d
        on date_trunc(
            'hour',
            i.ts
        ) = d.hour
        and i.pool_id = d.pool_id
        and lower(
            i.collateral_type
        ) = lower(
            d.collateral_type
        )
    where
        i.block_number <= (
            select
                max(
                    max_block_number
                ) as b
            from
                max_debt_block
        )
),

issuance as (
    select
        date_trunc(
            'hour',
            ts
        ) as ts,
        pool_id,
        collateral_type,
        sum(amount) as hourly_issuance
    from
        filt_issuance
    group by 1,2,3
    order by pool_id, collateral_type, ts desc
)

select
    dim.ts as ts,
    dim.pool_id as pool_id,
    dim.collateral_type as collateral_type,
    coalesce(
        i.hourly_issuance,
        0
    ) as hourly_issuance
from
    dim
left join issuance as i
    on
        dim.pool_id = i.pool_id
        and lower(
            dim.collateral_type
        ) = lower(
            i.collateral_type
        )
        and dim.ts = i.ts

"""

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'pool_issuance_hourly'
    DATABASE = kwargs['analytics_db']
    
    client = get_client()
    result = client.query(QUERY_DEF.format(
        DEST_TABLE=TABLE_NAME,
        DEST_DB=kwargs['analytics_db'],
        RAW_DATABASE=kwargs['raw_db'],
        MAX_TS=data['max_ts'][0]
        ))
    
    print(result.result_rows)