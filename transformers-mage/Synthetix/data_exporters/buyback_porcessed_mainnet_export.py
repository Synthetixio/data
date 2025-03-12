if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    """
    Export core buyback processed data to ClickHouse
    """

    if kwargs['raw_db'] not in ['base_mainnet']:
        return {}
    
    TABLE_NAME = 'buyback_processed'
    DATABASE = kwargs['raw_db']

    # Convert block_number to UInt64
    data['block_number'] = data['block_number'].astype('uint64')  # UInt64
    
    # Convert all other fields to strings
    str_columns = [
        "id", 'snx', "buyer", "usd"
    ]

    for str_col in str_columns:
        data[str_col] = data[str_col].astype(str)
    
    client = get_client()
    
    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=data,
        column_names=data.columns.tolist()
    )
    
    return {'rows_inserted': len(data)}