if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'core_vault_debt'
    DATABASE = kwargs['raw_db']

    if len(data) == 0:
        print("data_inserted : ", len(data))
        return {}

    query = f"""
    INSERT INTO {DATABASE}.{TABLE_NAME}
    with base as (
        select
            block_number,
            contract_address,
            chain_id,
            pool_id,
            collateral_type,
            debt/1e18 as debt
        from
            {DATABASE}.core_vault_debt_parquet
        where
            debt is not null
    )

    select
        blocks.timestamp as ts,
        blocks.block_number as block_number,
        base.contract_address as contract_address,
        base.pool_id as pool_id,
        base.collateral_type as collateral_type,
        base.debt as debt
    from
        base
    inner join {DATABASE}.blocks_parquet as blocks
        on base.block_number = blocks.block_number
        where ts >= '{data['max_ts'][0]}'
    """

    client = get_client()
    client.query(query)