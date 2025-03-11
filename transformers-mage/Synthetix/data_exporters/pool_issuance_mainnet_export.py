if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    VIEW_NAME = 'pool_issuance'
    DATABASE = kwargs['analytics_db']

    query = f"""
        CREATE VIEW IF NOT EXISTS {DATABASE}.{VIEW_NAME} AS 
        with burns as (
            select
                block_timestamp as ts,
                block_number,
                transaction_hash,
                pool_id,
                collateral_type,
                account_id,
                -1 * amount / 1e18 as amount
            from
                {kwargs["raw_db"]}.core_usd_burned
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
                amount / 1e18 as amount
            from
                {kwargs["raw_db"]}.core_usd_minted
            order by
                block_timestamp desc
        )

        select *
        from
            burns
        union all
        select *
        from
            mints
        order by
            ts desc

    """

    client = get_client()
    client.query(query)
