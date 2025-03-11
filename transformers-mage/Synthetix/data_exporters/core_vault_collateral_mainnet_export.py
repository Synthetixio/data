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

    if 'block_number' in data.columns:
        data['block_number'] = data['block_number'].astype('uint64')
    
    client = get_client()

    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=data,
        column_names=data.columns.tolist()
    )
    
    print({'rows_inserted': len(data)})