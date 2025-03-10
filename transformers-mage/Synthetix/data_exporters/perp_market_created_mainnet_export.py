if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
import pandas as pd
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(df, *args, **kwargs):
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
    
    # Convert numeric columns to appropriate types
    try:
        df['block_number'] = df['block_number'].astype('int64')  # Int64, not UInt64
        df['perps_market_id'] = df['perps_market_id'].astype('float64')  # Float64 for numeric type
    except (ValueError, TypeError) as e:
        raise ValueError(f"Error converting numeric columns: {str(e)}")
    
    # Ensure string columns are actually strings
    string_columns = ['id', 'transaction_hash', 'contract', 'event_name', 'market_name', 'market_symbol']
    for col in string_columns:
        if col in df.columns:
            df[col] = df[col].astype(str)
   
    client = get_client()

    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=df,
        column_names=df.columns.tolist()
    )
    
    return {'status': 'success', 'rows_inserted': len(df)}