if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
import pandas as pd
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(df, *args, **kwargs):
    if kwargs['raw_db'] in ['eth_mainnet']:
        return {}
    
    TABLE_NAME = 'perp_market_created'
    DATABASE = kwargs['raw_db']
    
    required_columns = [
        'id', 'block_timestamp', 'block_number', 'transaction_hash', 'contract', 
        'event_name', 'perps_market_id', 'market_name', 'market_symbol'
    ]
    
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")
    
    # Convert block_timestamp to datetime if it's not already
    if 'block_timestamp' in df.columns and not pd.api.types.is_datetime64_any_dtype(df['block_timestamp']):
        df['block_timestamp'] = pd.to_datetime(df['block_timestamp'])
    
    # Convert block_number to UInt64 while keeping all others as strings
    df['block_number'] = df['block_number'].astype('uint64')
    
    # Convert all other columns to strings except block_timestamp
    str_columns = [
        'id', 'transaction_hash', 'contract', 'event_name', 
        'perps_market_id', 'market_name', 'market_symbol'
    ]
    for str_col in str_columns:
        df[str_col] = df[str_col].astype(str)
   
    client = get_client()

    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=df,
        column_names=df.columns.tolist()
    )
    
    return {'status': 'success', 'rows_inserted': len(df)}