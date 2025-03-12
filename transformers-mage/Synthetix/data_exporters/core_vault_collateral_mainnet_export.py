if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'core_vault_collateral'
    DATABASE = kwargs['raw_db']

    if len(data) == 0:
        print({'rows_inserted': len(data)})
        return {}

    query = f"""
        INSERT INTO  {DATABASE}.{TABLE_NAME}

        WITH base AS (
            SELECT
                block_number,
                contract_address,
                chain_id,
                pool_id,
                collateral_type,
                amount/1e18 as amount,
                collateral_value/1e18 as collateral_value
            FROM
                {DATABASE}.core_vault_collateral_parquet
            WHERE
                amount IS NOT NULL
        )

        SELECT
            blocks.timestamp AS ts,
            blocks.block_number as block_number,
            base.contract_address as contract_address,
            base.pool_id as pool_id,
            base.collateral_type AS collateral_type,
            base.amount AS amount,
            base.collateral_value AS collateral_value
        FROM
            base
        INNER JOIN {DATABASE}.blocks_parquet AS blocks
            ON base.block_number = blocks.block_number
        where ts >= '{data['max_ts'][0]}'
    """
    
    client = get_client()
    client.query(query)