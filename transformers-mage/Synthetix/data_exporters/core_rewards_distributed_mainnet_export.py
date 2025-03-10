if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    TABLE_NAME = 'core_rewards_distributed'
    DATABASE = kwargs['raw_db']
    
    required_columns = [
        'id', 'event_name', 'amount', 'start', 'contract', 'block_timestamp',
        'transaction_hash', 'collateral_type', 'block_number', 'duration',
        'distributor', 'pool_id'
    ]
    
    if not all(col in data.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {[col for col in required_columns if col not in data.columns]}")
    
    # Convert numeric columns to appropriate types
    data['block_number'] = data['block_number'].astype('uint64')  # UInt64
    data['pool_id'] = data['pool_id'].astype('uint64')  # UInt64
    data['amount'] = data['amount'].astype('float64')  # Float64
    data['start'] = data['start'].astype('uint64')  # UInt64
    data['duration'] = data['duration'].astype('uint64')  # UInt64
    
    
    client = get_client()
    
    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=data,
        column_names=data.columns.tolist()
    )
    
    return {'rows_inserted': len(data)}