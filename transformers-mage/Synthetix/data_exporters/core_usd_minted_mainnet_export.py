if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter
from Synthetix.utils.clickhouse_utils import get_client

@data_exporter
def export_data(data, *args, **kwargs):
    """
    Export core USD minted data to ClickHouse
    """
    TABLE_NAME = 'core_usd_minted'
    DATABASE = kwargs['raw_db']
    
    required_columns = [
        'pool_id', 'block_timestamp', 'account_id', 'collateral_type', 'block_number',
        'id', 'sender', 'amount', 'event_name', 'transaction_hash', 'contract'
    ]
    
    if not all(col in data.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {[col for col in required_columns if col not in data.columns]}")
    
    # Convert block_number to UInt64
    data['block_number'] = data['block_number'].astype('uint64')  # UInt64
    
    # Convert all other numeric fields to strings
    str_columns = [
        'pool_id', 'account_id', 'collateral_type', 'id', 'sender', 
        'amount', 'event_name', 'transaction_hash', 'contract'
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