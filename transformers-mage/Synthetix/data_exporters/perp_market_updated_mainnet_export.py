if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'perp_market_updated'
    DATABASE = kwargs['raw_db']
    
    required_columns = [
        'id', 'block_timestamp', 'block_number', 'transaction_hash', 'contract', 
        'event_name', 'market_id', 'price', 'skew', 'size', 'size_delta', 
        'current_funding_rate', 'current_funding_velocity', 'interest_rate'
    ]
    
    if not all(col in data.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {[col for col in required_columns if col not in data.columns]}")
    
    # Convert numeric columns to appropriate types
    data['block_number'] = data['block_number'].astype('uint64')  # UInt64
    data['market_id'] = data['market_id'].astype('uint64')  # UInt64
    
    # Convert decimal/float columns
    float_columns = ['price', 'skew', 'size', 'size_delta', 'current_funding_rate', 
                     'current_funding_velocity', 'interest_rate']
    for col in float_columns:
        if col in data.columns:
            data[col] = data[col].astype('float64')  # Float64
    
    client = get_client()

    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=data,
        column_names=data.columns.tolist()
    )
    
    return {'rows_inserted': len(data)}