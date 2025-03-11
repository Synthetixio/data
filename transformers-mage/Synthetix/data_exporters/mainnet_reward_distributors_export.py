if 'data_exporter' not in globals():
    from mage_ai.data_preparation.decorators import data_exporter

from Synthetix.utils.clickhouse_utils import get_client
import pandas as pd

@data_exporter
def export_data(data, *args, **kwargs):
    
    TABLE_NAME = 'reward_distributors'
    DATABASE = kwargs['raw_db']

    df = pd.read_csv(f'Synthetix/seeds/reward_distributors/{DATABASE}_reward_distributors.csv')
    
    required_columns = [
        'distributor_address', 'token_symbol', 'synth_token_address', 'reward_type'
    ]
    
    if not all(col in df.columns for col in required_columns):
        raise ValueError(f"Missing required columns: {[col for col in required_columns if col not in df.columns]}")
    
    # Define ClickHouse DDL
    ddl = f"""
        CREATE TABLE IF NOT EXISTS {DATABASE}.{TABLE_NAME}
        (
            distributor_address String,
            token_symbol String,
            synth_token_address Nullable(String),
            reward_type String,
        )
        ENGINE = ReplacingMergeTree()
        ORDER BY (distributor_address, token_symbol);
    """
    
    client = get_client()
    
    client.query(ddl)
    client.insert_df(
        table=f'{DATABASE}.{TABLE_NAME}',
        df=df,
        column_names=df.columns.tolist()
    )
    
    return {'rows_inserted': len(df)}