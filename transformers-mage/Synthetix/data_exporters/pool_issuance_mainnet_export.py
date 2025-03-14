if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    VIEW_NAME = 'pool_issuance'
    DATABASE = kwargs['analytics_db']

    query = f"""
        CREATE VIEW IF NOT EXISTS {DATABASE}.{VIEW_NAME} AS 
        WITH burns AS (
            SELECT
                block_timestamp AS ts,
                block_number,
                transaction_hash,
                pool_id,
                collateral_type,
                account_id,
                -1 * toInt256OrZero(amount) / 1e18 AS amount
            FROM
                {kwargs["raw_db"]}.core_usd_burned
            ORDER BY
                block_timestamp DESC
        ),

        mints AS (
            SELECT
                block_timestamp AS ts,
                block_number,
                transaction_hash,
                pool_id,
                collateral_type,
                account_id,
                toInt256OrZero(amount) / 1e18 AS amount
            FROM
                {kwargs["raw_db"]}.core_usd_minted
            ORDER BY
                block_timestamp DESC
        )

        SELECT *
        FROM
            burns
        UNION ALL
        SELECT *
        FROM
            mints
        ORDER BY
            ts DESC

    """

    client = get_client()
    client.query(query)
