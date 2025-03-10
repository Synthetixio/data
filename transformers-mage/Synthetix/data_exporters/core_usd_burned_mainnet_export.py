if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'core_usd_burned'
    DATABASE = kwargs['raw_db']
    
    required_columns = [
        'amount', 'pool_id', 'event_name', 'id', 'block_number', 'account_id', 
        'sender', 'transaction_hash', 'contract', 'collateral_type', 'block_timestamp'
    ]
    
    if not all(col in data.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {[col for col in required_columns if col not in data.columns]}")
    
    # Convert numeric columns to appropriate types
    data['block_number'] = data['block_number'].astype('uint64')  # UInt64
    data['pool_id'] = data['pool_id'].astype('uint64')  # UInt64
    data['account_id'] = data['account_id'].astype('uint64')  # UInt64
    data['amount'] = data['amount'].astype('float64')  # Float64
    
    client = get_client()
    
    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=data,
        column_names=data.columns.tolist()
    )
    
    return {'rows_inserted': len(data)}