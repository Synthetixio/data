if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

QUERY_DEF = """
INSERT INTO {DEST_DB}.{DEST_TABLE}

with rewards_claimed as (
    select
        block_timestamp as ts,
        CAST(
            pool_id as INTEGER
        ) as pool_id,
        account_id,
        collateral_type,
        distributor,
        toInt256OrZero(amount)/1e18 as amount
    from
        {RAW_DATABASE}.core_rewards_claimed
),

distributors as (
    select
        CAST(distributor_address as TEXT) as distributor_address,
        CAST(token_symbol as TEXT) as token_symbol,
        reward_type
    from
        {RAW_DATABASE}.reward_distributors
),

hourly_prices as (
    select
        ts,
        market_symbol,
        prices as price
    from
        {ANALYTICS_DB}.market_prices_hourly
)

select
    rc.ts,
    rc.pool_id,
    rc.collateral_type,
    rc.account_id,
    distributors.reward_type,
    rc.distributor,
    distributors.token_symbol,
    rc.amount,
    hourly_prices.price,
    rc.amount * hourly_prices.price as amount_usd
from
    rewards_claimed as rc
inner join distributors on rc.distributor = distributors.distributor_address
inner join
    hourly_prices
    on
        DATE_TRUNC('hour', rc.ts) = hourly_prices.ts
        and distributors.token_symbol = hourly_prices.market_symbol
order by
    rc.ts

"""

@data_exporter
def export_data(data, *args, **kwargs):
    
    TABLE_NAME = 'rewards_claimed'
    DATABASE = kwargs['analytics_db']
    
    client = get_client()
    result = client.query(QUERY_DEF.format(
        DEST_TABLE=TABLE_NAME,
        DEST_DB=kwargs['analytics_db'],
        ANALYTICS_DB=kwargs['analytics_db'],
        RAW_DATABASE=kwargs['raw_db'],
        MAX_TS=data['max_ts'][0]
        ))
    
    print(result.result_rows)