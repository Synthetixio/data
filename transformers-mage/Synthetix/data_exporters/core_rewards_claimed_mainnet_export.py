if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    """
    export filtered rewards claimed data to clickhouse
    """

    TABLE_NAME = 'core_rewards_claimed'
    DATABASE = kwargs['raw_db']
    
    required_columns = [
        'id', 'block_timestamp', 'block_number', 'transaction_hash', 'contract', 
        'amount', 'collateral_type', 'event_name', 'account_id', 'pool_id'
    ]
    
    if not all(col in data.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {[col for col in required_columns if col not in data.columns]}")
    

    data['block_number'] = data['block_number'].astype('uint64')  # UInt64

    str_columns = [
        'id', 'transaction_hash', 'contract', 'amount', 'collateral_type', 'event_name',
        'account_id', 'pool_id'
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

