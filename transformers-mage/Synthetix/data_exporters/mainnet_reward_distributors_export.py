if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

from Synthetix.utils.clickhouse_utils import get_client
import pandas as pd
import os

@data_exporter
def export_data(data, *args, **kwargs):
    
    TABLE_NAME = 'reward_distributors'
    DATABASE = kwargs['raw_db']
    
    file_path = f'Synthetix/seeds/reward_distributors/{DATABASE}_reward_distributors.csv'

    # Define ClickHouse DDL
    ddl = f"""
        CREATE TABLE IF NOT EXISTS {DATABASE}.{TABLE_NAME}
        (
            distributor_address String,
            token_symbol String,
            synth_token_address Nullable(String),
            reward_type String
        )
        ENGINE = ReplacingMergeTree()
        ORDER BY (distributor_address, token_symbol);
    """
    
    client = get_client()
    # make sure table exists
    client.query(ddl)

    # Try to read the CSV file
    try:
        df = pd.read_csv(file_path)
        print(f"Successfully read CSV with shape: {df.shape}")
    except (pd.errors.EmptyDataError, FileNotFoundError) as e:
        # Handle empty file or file not found
        print(f"Warning: {e}. Proceeding with empty DataFrame.")
        df = pd.DataFrame(columns=[
            'distributor_address', 'token_symbol', 'synth_token_address', 'reward_type'
        ])
    except Exception as e:
        # Handle any other errors
        print(f"Error reading CSV: {e}. Proceeding with empty DataFrame.")
        df = pd.DataFrame(columns=[
            'distributor_address', 'token_symbol', 'synth_token_address', 'reward_type'
        ])
    
    # If the DataFrame is empty, just return without inserting into database
    if df.empty:
        print("DataFrame is empty. No data to insert.")
        return {'rows_inserted': 0}
    
    # Check for required columns
    required_columns = [
        'distributor_address', 'token_symbol', 'synth_token_address', 'reward_type'
    ]
    
    if not all(col in df.columns for col in required_columns):
        missing_cols = [col for col in required_columns if col not in df.columns]
        print(f"Warning: Missing required columns: {missing_cols}. Creating empty columns.")
        
        # Create missing columns with empty values
        for col in missing_cols:
            df[col] = None
    
    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=df,
        column_names=df.columns.tolist()
    )
    
    return {'rows_inserted': len(df)}